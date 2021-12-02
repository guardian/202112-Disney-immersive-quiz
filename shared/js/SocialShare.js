import { Component, render, h } from "preact";
import { TwitterShare, FacebookShare, EmailShare, LinkedinShare, PinterestShare } from "preact-social";

let shareUrl=null, title=null, iconSize=24;
export default class SocialShare extends Component {
    constructor(props){
        super(props);
        shareUrl = this.props.url;
        iconSize = this.props.iconSize || iconSize;
        console.log('SocialBar mount', shareUrl);
        title = this.props.title || '';

    }

    componentWillMount() {
        if (!shareUrl) {
            shareUrl = window.location.href;
        }
    }
  

  render(props, { results = [] }) {
    return (
          <ul className="list-unstyled">
            <li>
                <FacebookShare url={shareUrl} size={iconSize} circle />
            </li>
            <li>
                <TwitterShare url={shareUrl} text={title} size={iconSize} circle />
            </li>
            <li>
                <EmailShare url={shareUrl} text={title} size={iconSize} circle />
            </li>
            <li>
                <LinkedinShare url={shareUrl} text={title} size={iconSize} circle />
            </li>
            <li>
                <PinterestShare url={shareUrl} text={title} size={iconSize} circle />
            </li>
        </ul>
    );
  }
}
