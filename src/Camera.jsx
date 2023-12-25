import { 
    Vector3, 
    ArcRotateCamera 
} from "@babylonjs/core"

export default class Camera{
    constructor(scene){
        this.scene = scene

        this.horizontalSpeed = 0.005
        this.verticalSpeed = 0.0008

        this.lowerBetaLimit = 60 * Math.PI / 180
        this.upperBetaLimit = 85 * Math.PI / 180

        this.scene.camera = this.createCamera()
        this.handleMouseMovement()
    }

    createCamera(){
        const camera = new ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 10, Vector3.Zero(), this.scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(this.ref, false)
        camera.inputs.clear()

        return camera
    }

    handleMouseMovement(){

        this.scene.camera.lowerBetaLimit = this.lowerBetaLimit
        this.scene.camera.upperBetaLimit = this.upperBetaLimit

        var canvas = this.scene.getEngine().getRenderingCanvas()
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock

        canvas.onclick = function() {
            canvas.requestPointerLock()
        }

        const updateCamera = (evt) => {
            let deltaX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0
            let deltaY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0

            this.scene.camera.alpha -= deltaX * this.horizontalSpeed
            this.scene.camera.beta -= deltaY * this.verticalSpeed
        }

        const lockChangeAlert = () => {
            if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas) {
                document.addEventListener("mousemove", updateCamera, false)
            } else {
                document.addEventListener("mousemove", updateCamera, false)
            }
        }

        document.addEventListener('pointerlockchange', lockChangeAlert, false)
        document.addEventListener('mozpointerlockchange', lockChangeAlert, false)
        document.addEventListener('webkitpointerlockchange', lockChangeAlert, false)
    }
}