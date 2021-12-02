import gsap from "gsap/gsap-core";
import ScrollTrigger from "gsap/ScrollTrigger";
import {h, Component} from "preact";
import { useEffect, useRef } from "preact/hooks";
import AudioPlayer from "../../../../shared/js/AudioPlayer";

const setHtml = (html) => ({__html: html});

const Image = ({panel, animation, startPos, endPos, index}) => {
    const ref = useRef();
    // const endPos = '80%';
    const anim = JSON.parse(animation)[index];

    // useEffect(()=>{
    //     ref.current.addEventListener('load', () => {
    //         ScrollTrigger.create({
    //             trigger: ref.current,
    //             start: 'top 100%',
    //             end: `80% ${endPos}`,
    //             scrub: 1.2,
    //             animation: gsap.from(ref.current,Object.assign({ease:'sine.in'}, anim))
    //             // markers: true
    //         })   
    //     });
    // },[]);
    return (
        <div className="clip" style={{overflow:'hidden'}}>
            <img ref={ref} alt="" src={`<%= path %>/${panel}${index+1}.png`} />
        </div>
    )
}

const Collage = (props) => {

    return (
        <div className="collage">
            {new Array(parseInt(props.images,10)).fill(null).map((v,i)=> <Image {...props} key={i} index={i}></Image>)}
            <div className="heading" dangerouslySetInnerHTML={setHtml(props.heading)}>

            </div>
        </div>
    )

}

const innerHTML = (html) => {
    return {__html: html};
}

const Section = (props) => {

    const panelRef = useRef();
    const contentRef = useRef();
    const sectionRef = useRef();

    useEffect(()=>{
        // set background color
        sectionRef.current.style.setProperty('--panelBgColor', props.bgColor);

        // Pin

        // ScrollTrigger.matchMedia({
        //     "(min-width: 980px)": function() {
        //         const st = ScrollTrigger.create({
        //             trigger: panelRef.current,
        //             start: 'top 0%',
        //             end: 'bottom 100%',
        //             scrub: 2.2,
        //             // markers: true,
        //             pin: true,
        //             invalidateOnRefresh: true
    
        //         });

        //         return () => {
        //             st.kill();
        //         }
        //     }
        // });
        // // refresh with depaly to allow for page to settle
        // setTimeout(()=>{
        //     ScrollTrigger.refresh();
        // }, 1500);

        // // Heading animation
        // const h2 = contentRef.current.getElementsByTagName('h2');
        // ScrollTrigger.create({
        //     trigger: h2,
        //     start: 'top 90%',
        //     end: 'bottom 100%',

        //     scrub: 2.2,
        //     animation: gsap.from(h2, {x: "30", alpha:0, ease: 'sine.in'}),
        // });

        // // Paragraph animation
        // contentRef.current.getElementsByTagName('p').forEach((v)=>{

        //     ScrollTrigger.create({
        //         trigger: v,
        //         start: 'top 90%',
        //         end: 'bottom 100%',
    
        //         scrub: 2.2,
        //         animation: gsap.from(v, {y: "30", alpha:0, ease: 'sine.in'}),

        //     });        
        // })

        // // Quote animation
        // contentRef.current.getElementsByTagName('q').forEach((v)=>{

        //     ScrollTrigger.create({
        //         trigger: v,
        //         start: 'top 90%',
        //         end: 'bottom 100%',
    
        //         scrub: 2.2,
        //         animation: gsap.from(v, {scale: 0.8, alpha:0, ease: 'sine.in'}),   
        //     });        
        // })
        
    }, []);

    const getBg = ()  => props.bg? {backgroundImage:`url(<%= path %>/${props.bg})`} : {};

    return (
        <section ref={sectionRef} className={`container feature ${props.panel}`} style={getBg()}>
            <div className="panel" ref={panelRef}>
                <div className="bg">
                    <div className="wrap">

                        <Collage {...props} />
                        
                    </div>
                </div>
            </div>
            
            <div className="content">
                <div className="wrap" ref={contentRef}>
                    <div dangerouslySetInnerHTML={innerHTML(props.content)}></div>
                    
                    <div className="audio">
                        <div className="title">Listen</div>
                        <div className="player-body">
                            <AudioPlayer title="" src={`<%= path %>/audio/${props.audio}`}  />
                            <div className="desc" dangerouslySetInnerHTML={innerHTML(props.audioDesc)} ></div>

                        </div>
                    </div>
                    <div dangerouslySetInnerHTML={innerHTML(props.content2)}></div>
                </div>
            </div>
        </section>
    )
}

export default Section;