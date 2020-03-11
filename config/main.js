const width = 1440
const height = 700

const canvas = document.querySelector('#canvas-container>canvas')
canvas.style.width = `${width}px`
canvas.style.height = `${height}px`

const engine = new BABYLON.Engine(canvas, true)
const scene = new BABYLON.Scene(engine)
const camera = new BABYLON.ArcRotateCamera('camera', new BABYLON.Vector3(0, 5,-10), scene)
camera.setTarget(new BABYLON.Vector3(0, 5, 0))
camera.attachControl(canvas, false)

BABYLON.SceneLoader.Append("config/", "thigh3.gltf", scene, function (scene) {
    // Create a default arc rotate camera and light.
    scene.createDefaultCameraOrLight(true, true, true)
    
    // The default camera looks at the back of the asset.
    // Rotate the camera by 180 degrees to the front of the asset.
    scene.activeCamera.alpha -= Math.PI/4
    scene.activeCamera.radius = 8
    console.log(scene.materials.map(m => m.name))
    console.log(scene.materials)
    
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 0, 0), scene);
	light.diffuse = new BABYLON.Color3(0.89, 0.89, 0.89);
	light.specular = new BABYLON.Color3(0.73, 0.53, 0.53);
	light.groundColor = new BABYLON.Color3(0.75, 0.72, 0.72);

    scene.ambientColor = new BABYLON.Color3(1,1,1)
    scene.clearColor = new BABYLON.Color4(1,1,1,1)

    document.querySelectorAll('.color-selector').forEach(c => {
        const materiaux = scene.materials.find(d => d.name == c.dataset.materiaux)
        console.log(materiaux.name)
        c.querySelectorAll('div').forEach(d => {
            const color = d.style.backgroundColor
            d.addEventListener('click', e => {
                if(color === 'white') {
                    materiaux._albedoColor.r = 1
                    materiaux._albedoColor.g = 1
                    materiaux._albedoColor.b = 1
                }
                else if(color === 'grey') {
                    materiaux._albedoColor.r = 0.6
                    materiaux._albedoColor.g = 0.6
                    materiaux._albedoColor.b = 0.6

                }
                else if (color === 'yellow') {
                    materiaux._albedoColor.r = 1
                    materiaux._albedoColor.g = 1
                    materiaux._albedoColor.b = 0
                    
                }
                else if (color === 'red') {
                    materiaux._albedoColor.r = 1
                    materiaux._albedoColor.g = 0
                    materiaux._albedoColor.b = 0
                }
            })
        })
    })

    document.querySelectorAll('.hide-show').forEach(c => {
        const mesh = scene.meshes.find(d => d.name === c.dataset.element)
        const buttons = c.querySelectorAll('div')
        buttons.forEach((d, i) => {
            d.addEventListener('click', e => {
                buttons.forEach(b => b.style.backgroundColor = 'rgb(211, 211, 211)')
                d.style.backgroundColor = '#9e9ef3'
                mesh.visibility = parseInt(d.dataset.visibility)
            })
        })
    })
})


engine.runRenderLoop(function() {
    scene.render()
})

