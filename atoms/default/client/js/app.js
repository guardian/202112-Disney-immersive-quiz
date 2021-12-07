// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h, Fragment, createContext } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Body from "./Body";
import store, { ACTION_SET_SECTIONS, fetchData, assetsPath, ACTION_SET_VIEW, ACTION_SET_SCORE, ACTION_GENERATE_QUESTIONS } from "./store";
import {SwitchTransition, Transition, TransitionGroup} from "react-transition-group";
import { IconBackArrow, IconCabin, IconSkyactive, IconSound, IconStyle, IconSustainable, Logo, ScrollDown, IconExplore, IconHome, IconFba, IconFbb, IconFbc, IconFbd, IconRestart, IconBack, IconNext, IconStart, IconTick, IconCross, IconStar} from "./Icons";
import {Provider, useSelector, useDispatch} from "react-redux";
import { useEffect, useRef, useState } from "preact/hooks";
import HoverButton from "./HoverButton";

import Lev from "js-levenshtein";

let dispatch;

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    duration: 0.8,
    ease: 'sine.inOut'
});

const setHtml = (html) => ({__html: html});

const scrollToTop = () => {
    const t = document.getElementById('feature-top');
    // if (Math.abs(t - window.scrollY) < 200) {
    //     return false;
    // } 
    t.scrollIntoView({
        behavior: 'smooth'
    });
    return false;
}

const Container = ({children}) => {
    return (
        <div className="md:container  md:mx-auto">
            {children}
        </div>
    )
}
// const FlexContainer = (props) => {
const FlexContainer = ({children, className}) => {
    return (
        <div className={`flex-container ${className}`} >
            {children}
        </div>
    )
}


const Loading = () => 
    <FlexContainer className="loading">
        <div style={{width: 300}}>
            <img src={`${assetsPath}/glab_logo.svg`} />
        </div>
    </FlexContainer>


const Attribution = ({content}) => {
    return (
        <div className="attribution">
            <p>Paid for by 
                <a href={content.logoLink} className="block" target="_blank">
                    <Logo />
                </a>
            </p>
        </div>
    )
}

const ClientHubLink = ({children, href = '#'}) => 
    <div className="client-hub-link">
        <a href={href} target="_blank">{children}</a>
    </div>

const Header = () => {
    const content = useSelector(s=>s.content);

    return (
        <div>
            <div className="header relative">
                <Attribution content={content} />
            </div>
        </div>        
    )
}

const Footer = ({content, related, shareUrl}) => {

    return (
        <Fragment>

            <section className="footer dark-text px-2">
                <div className="content">
                    <div className="cta-wrap">
                        <div className="cta" dangerouslySetInnerHTML={setHtml(content.cta)} />
                        <div className="share">
                            <SocialBar title={content.shareTitle} url={shareUrl} />
                        </div>
                    </div>
                    
                </div>
            </section>

            <section className="related p-8">
                    <div className="mx-auto" >
                        <h3>Related content</h3>
                        <RelatedContent cards={related} />
                    </div>
            </section>
        </Fragment>
    )
}

const Standfirst = ({content}) => {

    return (
        <div className="standfirst">
                <div className="content" dangerouslySetInnerHTML={setHtml(content.standfirst)}></div>
        </div>
    )
}
const SmoothScroll = ({children}) => {
    const app = useRef();
    const [pos, setPos] = useState(window.scrollY);
    useEffect(()=>{
        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            const dy = pos-window.scrollY;
            console.log(Math.max(-2100, dy));
            setPos(window.scrollY);
            gsap.to(app.current, {duration: 0.5, y: Math.max(-2100, dy), ease: 'sine.out'});
        });
    },[])
    return (
        <div ref={app}>
            {children}
        </div>
    )
}

const FeatureImage = ({src, className}) => {
    return (
        <img className={`feature-image ${className}`} src={src} />
    )
}

const DefaultPanel = (props) => {
    const view = useSelector(s=>s.UI.view);

    return (
        <div className={`panel-default ${props.className} view-${view}`} style={props.style} >
            <div className="wrap">
                    <div className="body m-auto">
                        {props.children}

                    </div>
            </div>            
        </div>
    )
}
const Button = (props) => {
    return (
        <a href={props.href ?? '#'} className={`btn ${props.className}`}  onClick={props.onClick}>
            <div className="wrap">{props.children}</div>
        </a>
    )
}
const HomePanel = (props) => {
    const globalData = useSelector(s=>s.content);
    const data = useSelector(s=>s.content.sections.home);

    const handleClick = (e) => {
        e.preventDefault();
        dispatch({type:ACTION_SET_VIEW, payload: 'intro'})
    }
    return (
        <DefaultPanel className="home-panel text-center" style={{backgroundImage:`url(${assetsPath}/landing_bg_2x.jpg)`}}>
            
            <div className="header">
                <Attribution content={globalData} />

            </div>
            {/* <h4><a href={globalData.hubLink}>{globalData.hubLabel}</a></h4> */}
            <h1>{globalData.headline}</h1>
            <h2 className="max-w-md mx-auto">{globalData.subhead}</h2>
            <div className="max-w-md mx-auto" dangerouslySetInnerHTML={setHtml(globalData.standfirst)} />
            <Button onClick={handleClick}>{globalData.start}&nbsp;&nbsp;<IconStart /></Button>

        </DefaultPanel>
    )
}


const FeedbackPanel = (props) => {
    const globalData = useSelector(s=>s.content);
    const data = useSelector(s=>s.content.sections);
    const questions = useSelector(s=>s.sheets.questions);
    const score = useSelector(s=>s.UI.score);
    const [fb, setFB] = useState({});
    const [featImage, setImage] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        dispatch({type:ACTION_GENERATE_QUESTIONS})
        dispatch({type:ACTION_SET_VIEW, payload: 'quiz'})
    }

    useEffect(()=>{
        const pct = score/globalData.questionCount;
        if (pct > .75) {
            setFB(data.fba);
            setImage([
                h(IconStar,{filled: true, delay: 0}),
                h(IconStar,{filled: true, delay: 1.2}),
                h(IconStar,{filled: true, delay: 2.4}),
                h(IconStar,{filled: true, delay: 3.6}),
            ]);
        } else if (pct > .5) {
            setFB(data.fbb);
            setImage([
                h(IconStar,{filled: true, delay: 0}),
                h(IconStar,{filled: true, delay: 0.2}),
                h(IconStar,{filled: true, delay: 0.4}),
                h(IconStar),
            ]);
        } else if (pct > .25) {
            setFB(data.fbc);
            setImage(h(IconFbc));
            setImage([
                h(IconStar,{filled: true, delay:0}),
                h(IconStar,{filled: true, delay:0.2}),
                h(IconStar),
                h(IconStar),
            ]);
        } else {
            setFB(data.fbd);
            setImage([
                h(IconStar,{filled: true}),
                h(IconStar),
                h(IconStar),
                h(IconStar),
            ]);
        }
    },[]);

    return (
        <DefaultPanel className="feedback-panel text-center"  style={{backgroundImage:`url(${assetsPath}/003_bg_1x.jpg)`}}>
            <div className="score">
                <h3 className="text-center" dangerouslySetInnerHTML={setHtml(globalData.resultsTitle)}> </h3>
            </div>

            <div className="rating flex">
                {featImage}
            </div>
            
            <h1>{fb.heading}</h1>
            <div className="max-w-md m-auto" dangerouslySetInnerHTML={setHtml(fb.content)} />
            <Button onClick={handleClick}>{globalData.retry}&nbsp;&nbsp;<IconRestart /></Button>
        </DefaultPanel>
    )
}

const IntroPanel = (props) => {
    const globalData = useSelector(s=>s.content);

    const handleClick = (e) => {
        e.preventDefault();
        dispatch({type:ACTION_SET_VIEW, payload: 'quiz'})
    }


    return (
        <DefaultPanel className="intro-panel text-center light-text" style={{backgroundImage:`url(${assetsPath}/001_bg_1x.jpg)`}}>
            <div className="max-w-md mx-auto mb-8" dangerouslySetInnerHTML={setHtml(globalData.intro)} />
            <a href="#" className="btn" onClick={handleClick}><IconNext /></a>
        </DefaultPanel>
    )
}

const QuizContext = createContext();

const QuizRadioButton = (props) => {
    const [checked, setChecked] = useState(false);
    const handleOnChange = (e) => {
        setChecked(s=>!s);
        props.onSelect(e);
    }
    return (
        <Fragment>
                <input checked={props.checked == props.value} type="radio" name={`qop`} id={`qop${props.count}`} value={props.value} onChange={handleOnChange} disabled={props.disabled} />
                <label className={props.ca? 'ca' : ''} for={`qop${props.count}`}>{props.label}</label>            
        </Fragment>
    )
    return (
        <Transition
        in={props.ca}
        key={props.label}
        timeout={2000}
        onEnter={n=>gsap.from(n,{duration:1, delay:0.5, alpha: 0})}
        // onExit={n=>gsap.to(n,{duration:1, alpha:0})}
        onExit={n=>console.log('exitting')}
        mountOnEnter
        unmountOnExit
        appear={true}
        >
            <div>
                <input checked={props.checked == props.value} type="radio" name={`qop`} id={`qop${props.count}`} value={props.value} onChange={handleOnChange} disabled={props.disabled} />
                <label className={props.ca? 'ca' : ''} for={`qop${props.count}`}>{props.label}</label>
            </div>
        </Transition>
    )
}

const QuestionOptions = ({className, onSelect, disabled}) => {
    // const [checked, setChecked] = useState(null);
    const [value, setValue] = useState(null);
    const ref = useRef();

    return (
        <QuizContext.Consumer>
            {data=> {

                useEffect(()=>{
                    setValue(null)
                    console.log(data.actor);
                    // gsap.from('.question-options label', {duration:.6, stagger:0.05, y: 30, alpha: 0, ease:'expo.out'});
                    ref.current.focus();
                },[data])

                const handleOnChange = (e) => {
                    e.preventDefault()
                    if (!value) return;
                    const lv  = Lev(data.actor.toLowerCase(), value.toLowerCase());
                    console.log(value, lv, data.actor);
                    // setChecked(e.target.value)
                    onSelect(lv < 4? true : false);
                }
            
                const inputRecieved = (e) => {
                    setValue(e.target.value);
                }
                const ops = (question) => {
                    const qid = question.id;
                    // const options = question.options.split('||');
                    // const checked = (new Array(options.length).fill(false));
            
                    return <form onSubmit={handleOnChange}>
                        <input ref={ref} type="text" name={`qop`} id={`qop${qid}`} value={value} onChange={inputRecieved} disabled={disabled} />
                        <button type="submit">Submit</button>
                    </form>
                };

                return (
                    <SwitchTransition>
                    <Transition
        key={data}
        timeout={1000}
        onEnter={n=>gsap.from(n.querySelectorAll('label'),{duration:0.5, y: 30, stagger: 0.05, alpha:0, rotateY: -20, ease: 'expo.out'})}
        onExit={n=>{gsap.to(n.querySelectorAll('label'),{duration:0.3, y: 10, stagger: 0.05, alpha:0, ease: 'expo.in'})}}
        // onExit={n=>console.log('exitting')}
        mountOnEnter
        appear={true}
        >  
                    <div className={`question-options ${className}`}>
                        {ops(data)}
                    </div>
                    </Transition>
                    </SwitchTransition>
                )
            }}
        </QuizContext.Consumer>
    )
    return ops();
}


const QuizNav = ({qList, onSelect}) => {
    return(
        <QuizContext.Consumer>
            {q => {
                const navList = () => {
                    return qList.map( (v, i) => 
                        <li className={i+1==q.id?'active':''}><a aria-role="button" href="#" title={`Question ${i+1}`} onClick={(e)=>{e.preventDefault();onSelect(i)}}>•</a></li>
                    )
                }
                return (
                    <nav className="quiz-nav">
                        <a href="# " title="Previous question" className="prev" onClick={(e)=>{e.preventDefault();onSelect(parseInt(q.id)-2)}}><IconBack /></a>
                        <ul className="inline">
                            { navList() }
                        </ul>
                        <a href="#" title="Next question" className="next" onClick={(e)=>{e.preventDefault();onSelect(parseInt(q.id))}}><IconNext /></a>
                    </nav>
                )
            }}
        </QuizContext.Consumer>
    )
}

window.gsap = gsap;

const ResultLabel = (props) => {
    return (
        <div className={`result-label inline-block ${props?.className}`} >
            <div className="flex justify-center items-center">
                {props.children}
            </div>
        </div>
    )

}

const ResultCa = (props) => {
    return (
        <ResultLabel className="ca">
            <IconTick />&nbsp;&nbsp;{props.label}
        </ResultLabel>
    )
}
const ResultFa = (props) => {
    return (
        <ResultLabel className="wa">
            <IconCross />&nbsp;&nbsp;{props.label}
        </ResultLabel>
    )
}

const QuizPanel = (props) => {
    const data = useSelector(s=>s.content.questions);
    const globalData = useSelector(s=>s.content);
    const [question, setQ] = useState(0);
    const [qState, setQstate] = useState(new Array(data.length).fill(0));
    const [score, setScore] = useState(0);
    const [ca, setCa] = useState(false);
    const [done, setDone] = useState(false);
    const points = 100/data.length;
    const [isLastQ, setLastQ] = useState(false);

    useEffect(()=>{
       setTimeout(() => {
        //    const h = document.querySelector('.question-body');
           console.log(data)
        //    h.style.minHeight = `${h.offsetHeight}px`;
       }, 500);


    },[])

    const onSelectOption = (e) => {
        if (e) {
            setQstate(s=> {
                s[question] = 1
                return [...s];
            })
            setScore(qState.reduce((p,c)=>p+c,0));
        }
        setCa(e);
        setDone(true)
    }

    const showQuestion = (id) => {
        console.log(data);
        if (id >= data.length) {
            dispatch({type:ACTION_SET_SCORE, payload: score});
            dispatch({type:ACTION_SET_VIEW, payload:'feedback'});
            return;
        }
        if (id == data.length - 1) {
            // last question
            setLastQ(true);
        }
        if (id >= 0) {
            setQ(id);
            setCa(false);
            setDone(false)
        }
    }

    const feedback = () => {
        return (
            <div className="text-center lg:flex lg:p-8">
                {/* <div style={{
                    background: `url(${assetsPath}/character_large_${data[question].image}.jpg) no-repeat 50%`,
                    height: '40vh'
                }} /> */}
                <div className="result-image"  style={{
                    backgroundImage: `url(${assetsPath}/character_large_${data[question].image}.jpg)`
                }}>
                    <img src={`${assetsPath}/character_large_${data[question].image}.jpg`} alt="" className="hidden lg:block" />

                </div>
                <div className="m-4 lg:m-8 -mt-4 results-block">
                    {ca && <ResultCa label={data[question].ca} />}
                    {!ca && <ResultFa label={data[question].fa} />}
                    <h2 className="mt-4">
                        <span dangerouslySetInnerHTML={setHtml(data[question].actor)} />
                        <br />
                        <span className="plays">Plays</span>
                        <br />
                        <span dangerouslySetInnerHTML={setHtml(data[question].role)} />
                        
                    </h2>
                    <div className="fb" dangerouslySetInnerHTML={setHtml(data[question].fbca)}></div>
                        {isLastQ && <Button><span dangerouslySetInnerHTML={setHtml(globalData.resultsButton)} onClick={(e)=>{e.preventDefault();showQuestion(parseInt(question+1))}}/>&nbsp;&nbsp;<IconStart /></Button>}
                        {!isLastQ &&
                    <a href="#" title="Next question" className="next inline-block" onClick={(e)=>{e.preventDefault();showQuestion(parseInt(question+1))}}><IconNext />
                        </a>}

                </div>
            </div>
        )
    }

    const Question = () => {
        return (
            <SwitchTransition>
                <Transition
                    key={done}
                    timeout={400}
                    onEnter={n=>gsap.from(n,{duration:0.5, scale: 1.3, alpha: 0})}
                    onExit={n=>{gsap.to(n,{duration:0.5, scale: .7, alpha:0})}}
                    // onExit={n=>console.log('exitting')}
                    mountOnEnter
                    // unmountOnExit
                    appear={true}
                    >
                        {!done && <div className="lg:m-8">
                            <div className="flex justify-center">
                                <div className="hidden lg:block">
                                    <FeatureImage src={`${assetsPath}/character_headshot_${data[question].image}.jpg`} />

                                </div>
                                <div className="flex justify-center flex-col p-4">
                                    <div className="question-text text-center" dangerouslySetInnerHTML={setHtml(data[question].questionText)}/>
                                    <FeatureImage className="lg:hidden" src={`${assetsPath}/character_headshot_${data[question].image}.jpg`} />
                                    <QuestionOptions onSelect={onSelectOption} className={(ca? 'complete': '') + ' text-center'} disabled={ca} />

                                </div>
                            </div>
                        </div>}
                        {done && feedback()}
                        
                </Transition>
            </SwitchTransition>            
        )
    }


    return (
        <DefaultPanel className="quiz-panel"  style={{backgroundImage:`url(${assetsPath}/002_bg_1x.jpg)`}}>

            
        
            <QuizContext.Provider value={data[question]}>
                {/* <div className="score">
                    Your score
                    <div>{Math.round((score / data.length) * 100) }</div>
                </div> */}
                <div className="question-body">

                    <SwitchTransition>
                        <Transition
                            key={question}
                            timeout={1000}
                            onEnter={n=>gsap.from(n,{duration:0.5, alpha: 0})}
                            onExit={n=>{gsap.to(n,{duration:0.1, alpha:0})}}
                            // onExit={n=>console.log('exitting')}
                            mountOnEnter
                            appear={true}
                            >
                                <div>{Question()}</div>
                        </Transition>
                    </SwitchTransition>                    
                    {/* <SwitchTransition>
                        <Transition
                            key={question}
                            timeout={400}
                            onEnter={n=>gsap.from(n,{duration:0.5, scale: 1.3, alpha: 0})}
                            onExit={n=>{gsap.to(n,{duration:0.5, scale: .7, alpha:0})}}
                            // onExit={n=>console.log('exitting')}
                            mountOnEnter
                            // unmountOnExit
                            appear={true}
                            >
                                
                        </Transition>
                    </SwitchTransition> */}
                


              
                    
                </div>


            </QuizContext.Provider>
        </DefaultPanel>
    )
}

const Break = () => <div className="break"><span></span><span></span><span></span></div>;

const MainBody = ({children}) => {

    return (
        <div className="main">
            {children}
        </div>
    )
}


const Main = () => {
    const loaded = useSelector(s=>s.dataLoaded);
    
    // const dispatch = useDispatch();

    dispatch = useDispatch();

    useEffect(()=>{
        dispatch( fetchData('https://interactive.guim.co.uk/docsdata/1bjgvgdGd49iM7vpb9-llx5aYUxhaP8aEXM3PYlN4SQA.json') );
    },[]);


    

    const content = useSelector(s=>s.content);
    const uiView = useSelector(s=>s.UI.view);

    const store = useSelector(s=>s);    

    const getCurrentView = () => {
        switch (uiView) {
            case 'home':
                return <HomePanel />;
            case 'intro':
                return <IntroPanel />;
            case 'feedback':
                return <FeedbackPanel />;
                default:
                    return <QuizPanel />;
        }
    }
    
    if (!loaded) return <Loading />;
 


    return (
        <SwitchTransition>
            <Transition
                key={loaded}
                timeout={1000}
                onEnter={n=>gsap.from(n,{alpha: 0})}
                onExit={n=>gsap.to(n,{alpha:0})}
                mountOnEnter
                unmountOnExit
                appear={true}
            >
                {!loaded && <Loading />}
                {loaded &&
                    
                    <MainBody>

                            <div className="feature-container relative">

                            
                            <SwitchTransition>
                                <Transition
                                    key={uiView}
                                    timeout={1000}
                                    onEnter={n=>gsap.from(n,{duration:.5, alpha: 0})}
                                    onExit={n=>gsap.to(n,{duration:0.5, alpha:0})}
                                    mountOnEnter
                                    unmountOnExit
                                    appear={true}
                                    >
                                        {getCurrentView()}
                                    </Transition>
                            </SwitchTransition>
                            </div>
                            <Break />
                            <Footer content={content} related={store.sheets.related} shareUrl={store.sheets.global[0].shareUrl} />
                        </MainBody>
                }
            </Transition>            
        </SwitchTransition>
    )
}


const App = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));

