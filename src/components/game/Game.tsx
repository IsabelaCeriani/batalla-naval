import './Game.css'
import React, {createElement, MouseEventHandler, useEffect, useState} from "react";
import {Snackbar} from "@mui/material";
import Loading from "../loading/Loading";

interface GameProps {
    positions: {id: string, x: number, y: number}[]
    shotsOwn: { x: number, y: number, hit: boolean}[]
    shotsOpponent: {x: number, y: number, hit: boolean}[]
    ownTurn: boolean
    onShoot: (squareId: string) => void
    // onFeedbackReceived: () => {}
}


const Game = (props: GameProps) => {

    const userSquares: HTMLDivElement[] = []
    const opponentSquares: HTMLDivElement[] = []

    const [load, setLoad] = useState(true)

    useEffect(() => {
        if(load && props.positions){
            // console.log(props.positions)
            renderUserBoard()
            renderOpponentBoard()
            renderShips()
            renderOwnShots()
            renderOpponentShots()
            setLoad(false)
        }
    }, [])

    useEffect(() => {
        if(!props.ownTurn) {
            document.querySelector('.opponent-board')?.classList.add('unavailable')
            opponentSquares.forEach(s => {
                s.classList.add('unavailable')
            })
        }else{
            document.querySelector('.opponent-board')?.classList.remove('unavailable')
            opponentSquares.forEach(s => {
                s.classList.remove('unavailable')
            })
        }
    })

    function renderUserBoard() {
        const grid = document.querySelector('.user-board')
        let i = 0

            while (userSquares.length < 100) {

                const square = document.createElement('div')
                square.dataset.id = String(i)
                grid?.appendChild(square)
                userSquares.push(square)
                i++

            }
    }

    function renderOpponentBoard() {
        const grid = document.querySelector('.opponent-board')
        let i = 0

        while (opponentSquares.length < 100) {

            const square = document.createElement('div')
            square.dataset.id = String(i)
            grid?.appendChild(square)
            opponentSquares.push(square)
            i++

        }
    }

    function renderShips() {

        if( props.positions !== undefined ) {
            props.positions.forEach(p => {
                const x = p.x
                const y = p.y

                const index = y*10 + x
                // console.log(index)
                // console.log(x)
                // console.log(y)
                userSquares[index].classList.add('taken')
            })
        }

    }

    function renderOwnShots() {
        props.shotsOwn.forEach(s => {
            const x = s.x
            const y = s.y

            const index = y*10 + x

            opponentSquares[index].classList.add( s.hit ? 'boom' : 'miss')

        })
    }

    function renderOpponentShots() {
        props.shotsOpponent.forEach(s => {
            const x = s.x
            const y = s.y

            const index = y*10 + x

            userSquares[index].classList.add( s.hit ? 'boom' : 'miss')

        })
    }

    function handleSquareClick(e: EventTarget) {
        // console.log(e.dataset.id)
        // console.log(props.ownTurn)
        if(props.ownTurn) {
            // @ts-ignore
            props.onShoot(e.dataset.id)
        }else{
            handleShowError()
        }
    }

    const [openError, setOpenError] = useState(false)
    function handleShowError() {
        // console.log(props.ownTurn)
        setOpenError(true)
        setTimeout(() => {
            setOpenError(false)
        }, 1000)
    }

    if(props.positions === undefined) {

        return <Loading />

    }


    return (
        <div className={'game-container'}>

            <div className={'board-container'}>
                <div className={'user-board'}></div>
                <div className={'opponent-board'} onClick={(event) => handleSquareClick(event.target)}></div>
            </div>
                {props.ownTurn ? (
                    <h3 className={'turn'}>Es tu turno!</h3>
                ):(
                    <h3 className={'turn'}>Es el turno de tu oponente!</h3>
                )}


            <Snackbar
                anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
                open={openError}
                message="No puedes atacar si no es tu turno!"/>

        </div>
    )

}

export default Game