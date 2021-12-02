const {ReactDOM, render} = window;

import AudioPlayer from "./components/AudioPlayer";

ReactDOM.render( <AudioPlayer title="Les Shern on dealing with his diagnosis" src="audio/clip_1_auspost.mp3" subs="audio/clip_1_auspost.vtt" />, document.getElementById('root'));
