import {JSX} from "react";

export class StatsObject {

    constructor(label: string, value: number | string, icon: JSX.Element, link: string, linkLabel: string) {
        this.label = label;
        this.value = value;
        this.icon = icon;
        this.link = link;
        this.linkLabel = linkLabel;
    }

    label?: string;
    value?: string | number;
    icon?: JSX.Element;
    link?: string;
    linkLabel?: string;
}