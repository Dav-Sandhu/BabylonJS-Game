import { PhysicsAggregate } from "@babylonjs/core"

class Object{

    constructor(scene, mesh, startPosition, shape){
        this.scene = scene

        this.mesh = mesh
        this.mesh.setPositionWithLocalVector(startPosition)

        this.shape = shape
    }

    enablePhysics = (mass, restitution, friction) => {
        this.mesh.physicsAggregate = new PhysicsAggregate(this.mesh, this.shape, { 
            mass: mass || 0, 
            restitution: restitution || 0, 
            friction: friction || 0
        }, this.scene)
    }

    enableCollision = () => {
        this.mesh.physicsAggregate.body.setCollisionCallbackEnabled(true)
        this.mesh.physicsAggregate.body.setCollisionEndedCallbackEnabled(true)
    }
}

export default Object