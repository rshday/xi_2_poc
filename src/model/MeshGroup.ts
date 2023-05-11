/* eslint-disable */
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

export default class MeshGroup{
    meshs : Array<BABYLON.AbstractMesh>;
    groups : Array<MeshGroup>;
    groupName : string
    rootGroupName : string

    constructor(groupName : string,rootGroupName: string)
    {
        this.groupName = groupName;
        this.rootGroupName = rootGroupName;
        this.meshs = new Array<BABYLON.AbstractMesh>();
        this.groups = new Array<MeshGroup>();
    }

    isThisGroup(name :string) :boolean{
        const words = name.split(" ");
        let lastGroupName = "";
        words.forEach(word=>{
            if(word.includes("Group"))
            {
                lastGroupName = word;
            }
        })
        console.log(words,lastGroupName)
        return true;
    }

    move(vec : Vector3)
    {
        this.meshs.forEach(x=>x.position = vec);
        this.groups.forEach(group =>{group.move(vec);});
    }

    test()
    {
        console.log("test")
    }
}