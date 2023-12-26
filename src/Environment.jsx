import HavokPhysics from "@babylonjs/havok"
import { HavokPlugin } from "@babylonjs/core/Physics"

import { 
    Scene, 
    Vector3,
    HemisphericLight, 
    ActionManager,
    MeshBuilder,
    PhysicsShapeType
} from "@babylonjs/core"

import "@babylonjs/inspector"

import Camera from "./Camera"
import Player from "./Player"
import Object from "./Object"

class Environment{
    constructor(engine, ref){
        this.engine = engine
        this.ref = ref
    }

    async createScene(){
        this.scene = new Scene(this.engine)
        this.scene.actionManager = new ActionManager(this.scene)

        new HemisphericLight('light', new Vector3(0, 1, 0), this.scene)
        new Camera(this.scene)

        await this.usePhysicsEngine(true)

        return this.scene
    }

    async addPlayer(position){

        const mesh = await this.importMesh("Head.glb", 1)
        
        this.player = new Player(
            this.scene, 
            this.engine, 
            position, 
            mesh, 
            100, 
            PhysicsShapeType.CONVEX_HULL
        )
    
        this.player.enablePlayerCollision()
        this.player.enableInput()
    }

    addGround(width, height, subdivisions){
        const ground = new Object(
            this.scene,
            MeshBuilder.CreateGround("ground", {
                width: width,
                height: height,
                subdivisions: subdivisions
            }, this.scene, false),
            Vector3.Zero(),
            PhysicsShapeType.BOX
        )
    
        ground.enablePhysics(0, 0, 1)
        ground.enableCollision()
    }

    async importMesh(item, scale){

        const { SceneLoader, Mesh } = await import('@babylonjs/core')

        const { meshes } = await SceneLoader.ImportMeshAsync("", "./models/", item, this.scene)

        const children = meshes[0].getChildMeshes()

        const mesh = children.length > 1 ? Mesh.MergeMeshes(children, true, true, null, false, true) : children[0]
        
        mesh.name = item.slice(0, -4)
        mesh.setParent(null)
        mesh.normalizeToUnitCube()
        mesh.bakeCurrentTransformIntoVertices()
    
        meshes[0].dispose()
        mesh.scaling = Vector3.One().scale(scale)

        return mesh
    }

    addItem(mesh, position){
        const object = new Object(
            this.scene,
            mesh,
            position,
            PhysicsShapeType.CONVEX_HULL
        )

        object.enablePhysics(1)
        object.enableCollision()
    }

    async usePhysicsEngine(enableGravity){
        const gravity = enableGravity ? new Vector3(0, -9.8, 0) : Vector3.Zero()

        const havokPlugin = await HavokPhysics()
        this.scene.enablePhysics(gravity, new HavokPlugin(true, havokPlugin))
    }

    enableDebugger() {
        this.scene.debugLayer.show({
            showInspector: true,
            showExplorer: true
        })
        this.scene.debugLayer.showColliders = true
    }
}

export default Environment