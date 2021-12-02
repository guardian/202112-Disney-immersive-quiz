import { Component, render, h } from "preact";

export default class RelatedContent extends Component {
    render (props) {
        const cards = props.cards.map(v=> 
            <div class="related-item">
                <a href={v.link} target="_blank">
                    {v.img && <div className="img" style={{backgroundImage:`url(${v.img})`}} />}
                    <p>{v.title}</p>
                </a>
            </div>
        )
        return (
            <div class="related-items">
                {cards}
            </div>
        );
    }
}