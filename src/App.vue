<template>
  <div>
    <canvas id="renderCanvas" touch-action="none"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { GridMaterial } from "@babylonjs/materials";
import '@babylonjs/loaders'
import {FBXLoader} from "babylonjs-fbx-loader"
import {SceneLoader} from "@babylonjs/core"
import MeshGroup from "./model/MeshGroup"

@Options({
  components: {
  },
  data() {
    return {
      meshGroupList : new Array<MeshGroup>(),
      rootMeshGroupList : new Array<MeshGroup>(),
    };
  },
  mounted(){
    this.$nextTick(async() => {
      this.initScene();
      await this.loadModel("Test Module2");
      let rootname = this.meshGroupList[0].rootGroupName;
      let rootgroup = this.meshGroupList[0];
      this.rootMeshGroupList.push(rootgroup);
      (this.meshGroupList as Array<MeshGroup>).forEach(meshgroup => {
        if(rootname === meshgroup.rootGroupName)
        {
          if(rootgroup != meshgroup)
          {
            rootgroup.groups.push(meshgroup);
          }
        }
        else
        {
          rootname = meshgroup.rootGroupName;
          rootgroup = meshgroup;
          this.rootMeshGroupList.push(rootgroup);
        }
      });
      const test : MeshGroup = (this.rootMeshGroupList as Array<MeshGroup>).find(x=>{return x.rootGroupName === "Group31"}) ?? new MeshGroup("null","null");
      console.log(this.rootMeshGroupList);
      test.move(new Vector3(1,1,0));
    });
  },
  methods: {
    getGroupName(name : string, level : number):string
    {
      const words = name.split(" ");
      let lastGroupName = "";
      words.some(word=>{
          if(word.includes("Group"))
          {
              lastGroupName = word;
              if(level != 0)
              {
                return true;
              }
          }
      })
      return lastGroupName;
    },
    async loadModel(name : string)
    {
      const model = await SceneLoader.ImportMeshAsync(null, "model/", `${name}.obj`, this._scene);
      //this.meshGroupList = new Array<MeshGroup>();
      let meshGroup:MeshGroup;
      model.meshes.some(mesh=>{
        if(mesh.name.includes("Group"))
        {
            const groupName = this.getGroupName(mesh.name,1);
            const rootGroupName = this.getGroupName(mesh.name,0);
            meshGroup = new MeshGroup(groupName,rootGroupName);
            meshGroup.meshs.push(mesh);
            this.meshGroupList.push(meshGroup);
        }
        else
        {
          if(meshGroup)
          {
            meshGroup.meshs.push(mesh);
          }
        }
      })
    },
    initScene() : void
    {
      this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

      this.engine = new BABYLON.Engine(this.canvas);
      this.scene = new BABYLON.Scene(this.engine);
      this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.setPosition(new BABYLON.Vector3(0, 80, -50));
      this.camera.attachControl(this.canvas, true);
      this.camera.panningSensibility = 300;
      this.light = new BABYLON.HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
      this.light.intensity = 1;

      const material = new GridMaterial("grid", this.scene);

      const ground = BABYLON.CreateGround("ground1", { width: 30, height: 30, subdivisions: 2 }, this.scene);
      ground.material = material;

      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  },
})
export default class App extends Vue {}
</script>

<style>
#app, body {
  margin: 0px;
}

#renderCanvas {
        width: 100%;
        height: 100%;
        display: block;
        font-size: 0;
      }
</style>
