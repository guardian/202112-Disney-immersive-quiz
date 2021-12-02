import {h, Component, Fragment} from "preact";
import Section from "./Section";
// import store from "./store";
import {Provider, useSelector} from 'react-redux';

export default () => {
    const sections = useSelector(s => s.sheets.sections);
    
    const list = sections.map((v,i)=>{
        return <Section {...v}></Section>;
    });    
    return (
        <div id="root">
            {list}
            
        </div>
    )
}

// export default function () {
//     return (<Provider  store={store} ><Brother/></Provider>)
// };