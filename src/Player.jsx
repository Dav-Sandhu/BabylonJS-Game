import { 
    ActionManager, 
    ExecuteCodeAction, 
    Vector3
} from "@babylonjs/core"

import Object from "./Object"

class Player extends Object{

    constructor(scene, engine, startPosition, mesh, speed, shape){
        super(scene, mesh, startPosition, shape)
        
        this.engine = engine

        this.inputMap = {}
        this.actionMap = {}
        this.speed = speed
        this.maxJumpVelocity = this.speed / 10
        
        this.enablePhysics(1, 0, 0, false)
        this.enableCollision()

        this.mesh.rotationQuaternion = null
    }

    cameraFollowPlayer = () => {
        //Used to update the physics body's rotation (doesn't do so by default to save computational power)
        this.mesh.physicsAggregate.body.disablePreStep = false

        //changes the mesh's rotation to face away from where the camera is looking
        this.mesh.physicsAggregate.body.setAngularVelocity(Vector3.Zero())
        let forward = this.scene.camera.getForwardRay().direction
        let direction = this.mesh.position.add(forward)
        direction.y = this.mesh.position.y
        this.mesh.lookAt(direction)
        this.scene.camera.target = this.mesh.position

        //saves computation as we only need it to update the rotation
        this.scene.onAfterPhysicsObservable.addOnce(() => {
            this.mesh.physicsAggregate.body.disablePreStep = true
        })
    }

    enablePlayerCollision = () => {
        const handleCollision = (e, action) => {  
            e.collidedAgainst._physicsEngine._physicsBodies.forEach(obj => {
                switch(obj.transformNode.name){
                    case "ground":
                        this.actionMap.jump = action
                    default:
                        break
                }
            })
        }

        //collision is currently happening.
        this.mesh.physicsAggregate.body.getCollisionObservable().add((e) => {
            handleCollision(e, true)
        })

        //collision has stopped happening.
        this.mesh.physicsAggregate.body.getCollisionEndedObservable().add((e) => {
            handleCollision(e, false)
        })
    }

    enableInput = () => {
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (e) => {
                let key = ((e.sourceEvent.key !== " " ? e.sourceEvent.key : e.sourceEvent.code) || "").toLowerCase()
                this.inputMap[key] = true
            })
        )
        
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (e) => {
                let key = ((e.sourceEvent.key !== " " ? e.sourceEvent.key : e.sourceEvent.code) || "").toLowerCase()
                this.inputMap[key] = false
            })
        )

        this.scene.onBeforeRenderObservable.add(()=> {
            let curSpeed = (this.speed * (this.inputMap.shift ? 2 : 1)) / this.engine.getDeltaTime()

            let z = this.inputMap.w ? curSpeed : this.inputMap.s ? -curSpeed : 0
            let x = this.inputMap.d ? curSpeed : this.inputMap.a ? -curSpeed : 0

            if(this.inputMap.space && this.actionMap.jump){
                this.mesh.physicsAggregate.body.applyImpulse(new Vector3(0, curSpeed, 0), this.mesh.position)
            }

            this.inputMap.e ? console.log(this.mesh.physicsAggregate.body.getMassProperties()) : ""

            let y = this.mesh.physicsAggregate.body.getLinearVelocity().y

            let velocity = new Vector3(
                (this.mesh.forward.x * z) + (this.mesh.right.x * x), 
                y > this.maxJumpVelocity ? this.maxJumpVelocity : y, 
                (this.mesh.forward.z * z) + (this.mesh.right.z * x)
            )

            this.mesh.physicsAggregate.body.setLinearVelocity(velocity)
            this.cameraFollowPlayer()
        })
    }
}

export default Player