// import React, { useEffect, useRef, useState } from "react";
// import "./../../css/main.scss";
import { Component, render, h } from "preact";

import { useEffect, useRef, useState } from 'preact/hooks';

const AudioPlayer = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [subsActive, setSubsActive] = useState(false);
    const [cueText, setCueText] = useState('');
    const [audio, setAudio] = useState(null);
    const [progress, setProgress] = useState({
        percent: 0,
        currentTime: 0,
        duration: 0
    });
    const progRef = useRef();
    const trackRef = useRef();

    const dasharray = 854;

    const audRef = useRef();
    
    const showIcon = false;
    const getDuration = (dur)=>{

        let Min = Math.floor(dur/ 60)

        let sec = (dur - Min * 60).toFixed(0);

        sec = ("0" + sec).slice(-2)
        Min = ("0" + Min).slice(-2)

        return `${Min} : ${sec}`

    }


    useEffect( () => {
        const aud = audRef.current;
        // const aud = new Video(props.src || '<%= path %>/audio/clip_1_auspost.mp3');
        // console.log(aud);
        if (props.subs) {
            aud.textTracks[0].addEventListener('cuechange', e => {
                const track = aud.textTracks[0];
                if (track.activeCues.length) {
                    // console.log(e.target.activeCues[0].text);
                    // console.log(track.activeCues.join(''));
                    setCueText( Array.from(track.activeCues).map(i=>i.text).join() );
                } else {
                    setCueText('');
                }
            })
        }
        aud.addEventListener('loadedmetadata', e=> {
            setProgress({...progress, duration:aud.duration});
        });
        aud.addEventListener('timeupdate', e=>{
            setProgress({
                percent:((aud.currentTime/aud.duration)),
                currentTime: aud.currentTime,
                duration: aud.duration
            });
            
        })
        aud.addEventListener('ended', e=>{
            setIsPlaying( false );
        })
        setAudio( aud );
    },[]);

    useEffect(()=>{
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        }
    },[props.stopPlay]);

    const handlePlayPause = () => {
        if (isPlaying) audio.pause();
        else audio.play();

        setIsPlaying(!isPlaying);
    }
    const handleSubsToggle = () => {
        setSubsActive(!subsActive);
    }

    const handleSeek = (e) => {
        const tw = progress.duration * (Math.max(0, e.offsetX)/ trackRef.current.offsetWidth);
        audRef.current.currentTime = tw;
        
    }

    const handleSkipBack = () => {

    }

    const skipBack = () => {
        audRef.current.currentTime -= 15;
    }
    const skipForward = () => {
        audRef.current.currentTime += 30;
    }

    return (
        <div className="audio-player" >

                    {props.title && <h2 className="title">
                        {showIcon && <svg className="AudioIcon " viewBox="0 0 300 300"><g><polygon points="143.5,89.7 108.2,125 84,125 77.6,131.3 77.6,167 83.4,172.7 107.9,172.7 143.5,208.3 150.2,208.3 150.2,89.7"></polygon><path d="M210.9,148.8c0,17.8-6.1,34.1-16.2,47.1l3.6,3.6c14.6-12,24-30.3,24-50.7c0-20.4-9.3-38.7-24-50.7l-3.6,3.6 C204.8,114.7,210.9,131.1,210.9,148.8"></path><path d="M177,148.8c0,10.3-3.1,19.8-8.4,27.8l4.2,4.2c8.2-8.2,13.3-19.5,13.3-32c0-12.5-5.1-23.8-13.3-32l-4.2,4.2 C173.9,129,177,138.6,177,148.8"></path></g></svg>}
                        {props.title}
                    </h2>}
            <div className="ap-container">
            <div className="progress-bar">

                <div 
                ariaRole="progress"
                ariaLabel="progress bar"
                className="track" ref={trackRef} onClick={handleSeek}><div className='current' style={{width: (progress.percent * 100) +'%'}}></div></div>
                <div className="time d-flex" style="justify-content: space-between; padding: 5px 0;">
                    <span ariaLabel="current time">{getDuration(progress.currentTime)}</span>
                    <span ariaLabel="duration">{getDuration(progress.duration)}</span>
                </div>
                </div>
                <div className="controls">

                    <button 
                        ariaRole="button"
                        ariaLabel="Skip back 15s"
                        onClick={skipBack} className={'btn-skip'}>
                        <div className="">
                            <svg viewbox="0 0 39 39">
                                <g>
                                    <path className="st0" d="M12.9542 -1.08586e-13C8.18676 0.00018772 3.97779 2.39661 1.46011 6.04831L1.48609 6.05784L1.68698 6.93692L2.76688 7.60443L3.61992 7.4076C5.6881 4.46942 9.09772 2.53859 12.9541 2.53843C19.251 2.53819 24.3724 7.66687 24.3722 13.9705C24.372 20.2723 19.2501 25.404 12.9532 25.4043C9.41465 25.4044 6.26498 23.7669 4.1719 21.232L8.74973 20.4949L8.7498 18.9084L0.618697 18.9087L0.000331324 19.5269L-1.31453e-13 27.9415L1.58656 27.9414L2.32893 23.0345L2.3324 23.031C4.89051 26.0357 8.69748 27.9446 12.9531 27.9445C20.6616 27.9441 26.9093 21.6871 26.9096 13.9704C26.91 6.25624 20.6627 -0.000303523 12.9542 -1.08586e-13" transform="matrix(0.76604444 0.6427876 0.6427876 -0.76604444 0.37532616 21.501482)" id="Skip" fill="#000000" fill-opacity="0.9019608" fill-rule="evenodd" stroke="none" />
                                    <path className="st0" d="M1.4903 6.7721L2.35654 6.7721L2.35654 0L1.86288 0L0 0.698634L0 1.22028L1.4903 1.01535L1.4903 6.7721ZM5.73766 6.87456C4.93662 6.87456 4.37776 6.70689 3.97724 6.45538L3.97724 5.75675C4.42433 5.98031 4.94594 6.12004 5.55137 6.12004C6.55732 6.12004 7.18139 5.70086 7.18139 4.69482C7.18139 3.67016 6.59458 3.34413 5.55137 3.34413C5.03908 3.34413 4.56405 3.41865 4.24736 3.52112L4.49885 0.0558908L7.90791 0.0558908L7.90791 0.801101L5.20674 0.801101L5.05771 2.78522C5.27194 2.68276 5.49548 2.60824 5.94257 2.60824C7.22796 2.60824 8.11283 3.24166 8.11283 4.68551C8.11283 6.01757 7.21864 6.87456 5.73766 6.87456Z" transform="translate(15.416311 16.482235)" id="15" fill="#000000" fill-opacity="0.9019608" stroke="none" />
                                </g>
                            </svg>
                        </div>
                    </button>
                    <button 
                        ariaRole="button"
                        ariaLabel="toggle play"
                        onClick={handlePlayPause} className={'btn-play ' + (isPlaying ? 'active' : '')}>
                        <div className="">
                            <svg viewBox="0 0 300 300"><g>

                            {isPlaying && 
                            <g>
                            <polygon className="st0" points="189.1,188.6 182.5,195.2 162.7,195.2 162.7,102.9 189.1,102.9 "></polygon>
                            <polygon className="st0" points="136.3,195.1 110,195.1 110,109.5 116.6,102.9 136.3,102.9 "></polygon>
                            </g>
                            }
                            {!isPlaying && <polygon className="st0" points="217.2,147.7 114.3,105.4 110.7,108.1 110.7,192 114.3,194.7 217.2,152.3 	"></polygon>}
                            </g></svg>
                        </div>
                    </button>
                    <button 
                        ariaRole="button"
                        ariaLabel="Skip forward 30s"
                        onClick={skipForward} className={'btn-skip'}>
                        <div className="">
                            <svg viewbox="0 0 40 39">
                                <g>
                                    <path className="st0" d="M12.9542 -3.10246e-15C8.18676 0.00018772 3.97779 2.39661 1.46011 6.04831L1.48609 6.05784L1.68698 6.93692L2.76688 7.60443L3.61992 7.4076C5.6881 4.46942 9.09772 2.53859 12.9541 2.53843C19.251 2.53819 24.3724 7.66687 24.3722 13.9705C24.372 20.2723 19.2501 25.404 12.9532 25.4043C9.41465 25.4044 6.26498 23.7669 4.1719 21.232L8.74973 20.4949L8.7498 18.9084L0.618697 18.9087L0.000331324 19.5269L-1.86723e-14 27.9415L1.58656 27.9414L2.32893 23.0345L2.3324 23.031C4.89051 26.0357 8.69748 27.9446 12.9531 27.9445C20.6616 27.9441 26.9093 21.6871 26.9096 13.9704C26.91 6.25624 20.6627 -0.000303523 12.9542 -3.10246e-15" transform="matrix(-0.76604444 0.64278764 -0.64278764 -0.76604444 38.952057 21.501482)" id="Skip" fill="#000000" fill-opacity="0.9019608" fill-rule="evenodd" stroke="none" />
                                    <path className="st0" d="M1.72316 6.93045C3.19483 6.93045 4.12627 6.21319 4.12627 4.95565C4.12627 3.95893 3.54878 3.48386 2.56145 3.30687L2.56145 3.26029C3.45563 3.00879 3.87478 2.47782 3.87478 1.67672C3.87478 0.614798 3.10169 0 1.90013 0C1.30401 0 0.726522 0.102466 0.270117 0.326029L0.270117 1.02466C0.698578 0.866307 1.06184 0.754525 1.67659 0.754525C2.46831 0.754525 2.97129 0.996718 2.97129 1.80713C2.97129 2.59892 2.43105 2.96221 1.57413 2.96221L1.08047 2.96221L1.08047 3.70742L1.6859 3.70742C2.64528 3.70742 3.20415 4.06139 3.20415 4.91839C3.20415 5.80332 2.5894 6.17593 1.53687 6.17593C1.00595 6.17593 0.456405 6.01757 0 5.81264L0 6.51127C0.391204 6.74415 0.922124 6.93045 1.72316 6.93045ZM7.85202 6.9584C9.29575 6.9584 10.4228 6.06415 10.4228 3.77263L10.4228 3.1392C10.4228 0.866307 9.23987 0 7.86134 0C6.48281 0 5.244 0.884937 5.244 3.2044L5.244 3.82852C5.244 6.0362 6.40829 6.9584 7.85202 6.9584ZM7.85202 6.21319C6.69704 6.21319 6.18475 5.38414 6.18475 3.83783L6.18475 3.07399C6.18475 1.52768 6.70635 0.735895 7.86134 0.735895C9.01632 0.735895 9.5193 1.59289 9.5193 3.12988L9.5193 3.89372C9.5193 5.50524 9.00701 6.21319 7.85202 6.21319Z" transform="translate(14.213767 16.426344)" id="30" fill="#000000" fill-opacity="0.9019608" stroke="none" />
                                </g>
                            </svg>
                        </div>
                    </button>
                </div>


                
                
                { props.subs &&
                <button 
                ariaRole="button"
                ariaLabel="toggle captions"
                onClick={handleSubsToggle}  className={'btn-subs ' + (subsActive ? 'active' : '')}>
                    <svg viewBox="0 0 67 67">
                    <g transform="translate(0.5 0.5)">
                        <path d="M32.7289 0C14.653 0 0 14.655 0 32.7309C0 50.8017 14.653 65.4578 32.7289 65.4578C50.8048 65.4578 65.4578 50.8017 65.4578 32.7309C65.4578 14.655 50.8048 0 32.7289 0" transform="translate(1.7053026E-13 0.00020307692)" />
                        <path d="M9.68677 22.6938C12.3674 22.6938 14.1342 22.2065 15.5658 21.4449L15.5658 17.5154L15.1771 17.6894C14.1041 18.1547 12.7262 18.612 10.7225 18.612C6.66784 18.612 5.29769 16.6278 5.24122 12.5167L5.23938 9.80862C5.23938 5.48308 7.24985 4.08185 10.7834 4.08185C12.672 4.08185 13.9514 4.44738 15.3831 4.96523L15.3831 1.03569C14.1646 0.365538 12.4892 0 10.0523 0C4.44738 0 0 2.61969 0 10.296L0 12.4588C0 19.5868 3.68585 22.6938 9.68677 22.6938ZM27.0295 22.6938C21.0286 22.6938 17.3428 19.5868 17.3428 12.4588L17.3428 10.296C17.3428 2.61969 21.7902 0 27.3951 0C29.832 0 31.5074 0.365538 32.7258 1.03569L32.7258 4.96523C31.2942 4.44738 30.0148 4.08185 28.1262 4.08185C24.5926 4.08185 22.5822 5.48308 22.5822 9.80862L22.5822 12.2455C22.5822 16.5406 23.9225 18.612 28.0652 18.612C30.3194 18.612 31.7815 18.0332 32.9086 17.5154L32.9086 21.4449C31.4769 22.2065 29.7102 22.6938 27.0295 22.6938Z" transform="translate(15.403486 21.333231)" stroke="none" class="st1" />
                    </g>
                    </svg>
                
                </button>
                }
            </div>
                <video src={props.src} ref={audRef} playsInline width="100%" height="80" crossOrigin="anonymous">
                    { props.subs && <track src={props.subs} kind="subtitles" srcLang="en" label="English" default /> }
                </video>
                { props.subs && subsActive &&
            <div className='subs'>
                {cueText}&nbsp;
            </div>
                }
        </div>
    )
}

export default AudioPlayer;