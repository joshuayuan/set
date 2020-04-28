import React from 'react';

class Shape extends React.Component {
  render() {
    let path;
    switch(this.props.shape) {
      case 0: // Diamond
        path = <path className={"stroke_" + this.props.colorStr.substring(1,4)} fill={this.props.fillStr} d="M71.4,275.46c-3.51-.19-4.8-2.95-6.07-5.49Q33.59,206.82,1.91,143.66C-.94,138,1,133.35,3.56,128.46Q35.24,68.08,66.88,7.69C68.53,4.54,69.65.05,74.34.54c3.72.38,4.78,4.24,6.22,7.14q30.27,61.1,60.5,122.2c3.28,6.6,2.66,12.65-.61,18.9q-31.3,59.88-62.57,119.76C76.4,271.38,75.28,274.75,71.4,275.46Z"/>;
        break;
      case 1: // Rectangle
        path = <path className={"stroke_" + this.props.colorStr.substring(1,4)} fill={this.props.fillStr} d="M128.31,135.67c0,23.59.16,47.17,0,70.75-.29,35-27.08,61.79-62.29,62.65-33.43.82-64.27-26.91-64.86-60.49Q-.19,134.14,1.2,59.66C1.81,25.6,31.31,0,66.82.51c33.55.52,60.88,27.24,61.44,60.7.42,24.82.09,49.64.09,74.46Z"/>;
        break;
      case 2: // Squiggle
        path = <path className={"stroke_" + this.props.colorStr.substring(1,4)} fill={this.props.fillStr} d="M128.31,135.67c0,23.59.16,47.17,0,70.75-.29,35-27.08,61.79-62.29,62.65-33.43.82-64.27-26.91-64.86-60.49Q-.19,134.14,1.2,59.66C1.81,25.6,31.31,0,66.82.51c33.55.52,60.88,27.24,61.44,60.7.42,24.82.09,49.64.09,74.46Z"/>;
        break;
      default:
        path = "";
        break;
    }

    return (
      <svg height="100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 143.73 275.97">
        <defs>
          <style>
            {".stroke_" + this.props.colorStr.substring(1,4) + "{stroke:"  + this.props.colorStr + "; stroke-width: 5px;}"}
          </style>
          <pattern id={"stripes_" + this.props.colorStr.substring(1, 4)}
            width="10" height="5"
            patternUnits="userSpaceOnUse">
            <line stroke={this.props.colorStr} strokeWidth="5px" y2="10"/>
          </pattern>
        </defs>
        <title>Asset 1</title>
        <g id="Layer_2" data-name="Layer 2">
            {path}
        </g>
      </svg>
    );
  }
}

class SVGs extends React.Component {
  constructor(props) {
    super(props);
  }

  getColorHex(colorInt) {
    switch(colorInt) {
      case 0: // red
        return "#f00";
      case 1: // green
        return "#0f0";
      case 2: // blue
        return "#00f";
      default:
        return "";
    }
  }

  getFillStr(fillInt, colorStr) {
    switch(fillInt) {
      case 0: // empty
        return "rgba(0, 0, 0, 0)"; // Transparent
      case 1: // stripes
        return "url(#stripes_" + colorStr.substring(1,4) + ")"; // Stripes pattern
      case 2: // solid
        return colorStr; // The color
      default:
        return "rgba(0, 0, 0, 0)"; // Randomly picked default to be transparent
    }
  }

  render() {
    const number = parseInt(this.props.value[0]) + 1; // 1, 2, or 3
    const colorStr = this.getColorHex(parseInt(this.props.value[1])); // Strings of form "#rgb" for Red Green Blue
    const shape = parseInt(this.props.value[2]); // 0: diamond 1: rectangle 2: squiggle
    const fill = parseInt(this.props.value[3]); // 0: empty 1: stripes 2: solid
    const fillStr = this.getFillStr(fill, colorStr);

    const icons = [];
    for (let i = 0; i < number; i++) {
      icons.push(<Shape shape={shape} fillStr={fillStr} colorStr={colorStr}/>);
    }
    return icons;
  }
}

export default SVGs;
