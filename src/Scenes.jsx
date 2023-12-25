import Environment from "./Environment"

import { Vector3 } from "@babylonjs/core"

export default function Scenes(engine, ref){
    const scene01 = async () => {
        const env = new Environment(engine, ref)

        const scene = await env.createScene()
        
        env.addGround(50, 50, 2)
        await env.addPlayer(new Vector3(0, 1, 0))

        return scene
    }

    return { scene01 }
}