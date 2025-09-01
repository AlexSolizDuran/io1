declare module "react-plotly.js" {
  import { Component } from "react";
  import Plotly from "plotly.js";

  export interface PlotParams {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
  }

  export default class Plot extends Component<PlotParams> {}
}
