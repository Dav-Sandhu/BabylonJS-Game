import { Engine } from "@babylonjs/core"
import { useRef, useEffect } from 'react'

import Scenes from "./Scenes"
import './Canvas.scss'

const Canvas = () => {
    const canvasRef = useRef(null)

    const createGame = async () => {

        const engine = new Engine(canvasRef.current, {
            adaptToDeviceRatio: true,
            antialias: true
        })

        const Scene = Scenes(engine, canvasRef)
        const scene = await Scene.scene01()

        engine.runRenderLoop(() => {
            scene.render()
        })
    }

    useEffect(() => {
        if(canvasRef !== null){
            createGame()
        }
    }, [])

    return (<canvas className="canvas" ref={canvasRef}></canvas>)
}
export default Canvas