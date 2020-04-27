import React from 'react';
import InlineSVG from 'svg-inline-react';

class Diamond extends React.Component {
  render() {
    const color= this.props.color;
    const fill = this.props.pattern;
    let fillStr = "";
    switch(fill) {
      case 0: // empty
        fillStr = "\" fill-opacity=\"0\"";
        break;
      case 1: // stripes
        fillStr = "url(#stripes_" + color.substring(1,4) + ")";
        break;
      case 2: // solid
        fillStr = color;
        break;
      default:
        fillStr = "\" fill-opacity=\"0\"";
        break;
    }
    const src = `<svg height="100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 143.73 275.97">
        <defs>
          <style>
          .stroke_` + color.substring(1,4) + `{stroke: ` + color + `; stroke-width: 5px;}
          </style>
          <pattern id="stripes_` + color.substring(1, 4) + `"
            width="5" height="5"
            patternUnits="userSpaceOnUse">
            <line stroke="` + color + `" stroke-width="5px" y2="10"/>
          </pattern>
        </defs>
        <title>Asset 1</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path class="stroke_` + color.substring(1,4) + `" fill="` + fillStr + `" d="M71.4,275.46c-3.51-.19-4.8-2.95-6.07-5.49Q33.59,206.82,1.91,143.66C-.94,138,1,133.35,3.56,128.46Q35.24,68.08,66.88,7.69C68.53,4.54,69.65.05,74.34.54c3.72.38,4.78,4.24,6.22,7.14q30.27,61.1,60.5,122.2c3.28,6.6,2.66,12.65-.61,18.9q-31.3,59.88-62.57,119.76C76.4,271.38,75.28,274.75,71.4,275.46Z"/>
          </g>
        </g>
      </svg>
`;
    return <span><InlineSVG src={src}/></span>;
  };
}

class Rectangle extends React.Component {
  render() {
    return <div />;
    // return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128.97 269.59"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;}</style></defs><title>Asset 4</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M128.31,135.67c0,23.59.16,47.17,0,70.75-.29,35-27.08,61.79-62.29,62.65-33.43.82-64.27-26.91-64.86-60.49Q-.19,134.14,1.2,59.66C1.81,25.6,31.31,0,66.82.51c33.55.52,60.88,27.24,61.44,60.7.42,24.82.09,49.64.09,74.46Z"/></g></g></svg>);
  }
}

class Squiggle extends React.Component {
  render() {
    return <div />;
    // return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.73 258.44"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;}</style></defs><title>Asset 3</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M122.1,69.21a147.57,147.57,0,0,1-13.57,53.87c-15.36,33.57-10.1,64.27,11.71,93.09,12.6,16.65,7.91,31.49-11.94,38.58-32.78,11.72-76.19-10.13-89.95-45.62C7,179.89,8.67,150.54,20.59,122.07,29.93,99.8,27,79.42,15.24,59.34c-4.19-7.13-8.56-14.2-12.1-21.65C-2.45,25.9.89,13.22,12.61,8,39.36-3.8,66-1.39,91.12,13.15,112.36,25.45,120.76,45.54,122.1,69.21Z"/></g></g></svg>);
  }

}

class SVGs extends React.Component {
  constructor(props) {
    super(props);
  }

  getColorHex(colorInt) {
    switch(colorInt) {
      case 0: // red
        return `#f00`;
      case 1: // green
        return `#0f0`;
      case 2: // blue
        return `#00f`;
      default:
        return ``;
    }
  }

  render() {
    const number = parseInt(this.props.value[0]) + 1; // 1, 2, or 3
    const color = this.getColorHex(parseInt(this.props.value[1])); // 0: red, 1: green, 2: blue
    const shape = parseInt(this.props.value[2]); // 0: diamond 1: rectangle 2: squiggle
    const fill = parseInt(this.props.value[3]); // 0: empty 1: stripes 2: solid

    const icons = [];
    for (let i = 0; i < number; i++) {
      switch(shape) {
        case 0:
          console.log(this.props.value, number, color, shape);
          icons.push(<Diamond pattern={fill} color={color}/>);
          break;
        case 1:
          icons.push(<Rectangle pattern={fill} color={color}/>);
          break;
        case 2:
          icons.push(<Squiggle pattern={fill} color={color}/>);
          break;
        default:
          break;
      }
    }
    return icons;
  }
}

export default SVGs;
