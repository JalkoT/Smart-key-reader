require('@tensorflow/tfjs-node')
const faceapi = require('./face-api-node.js')
const canvas = require('canvas')
const db = require('../db/config')

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
var faceMatcher

async function loadAll() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')
    const labeledFaceDescriptors = await loadLabeledImage()
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
}

async function run(qry_Image) {
    
    const qryImage = await canvas.loadImage(qry_Image)
    const resultQry = await faceapi.detectSingleFace(qryImage).withFaceLandmarks().withFaceDescriptor()
    
    if (resultQry) {
        const bestMatch = faceMatcher.findBestMatch(resultQry.descriptor)
        return bestMatch._label
    }
}

async function loadLabeledImage() {
    const doc = await db.imageLabels.doc('usersLabel').get()
    const labels = doc.data().labels
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++){

                const ref_Img = await canvas.loadImage(`./image/${label}/${i}.jpeg`)
                const refResult = await faceapi.detectSingleFace(ref_Img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(refResult.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

// run('./image/qryimg2.jpeg');
module.exports = {run, loadAll}