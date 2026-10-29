import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
const source = readFileSync(new URL("../src/components/EditorialHead.astro", import.meta.url), "utf8").match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
function boot({saved, dark = false, blocked = false} = {}) {
  const events = {}, windowEvents = {}, buttons = ["day", "night", "device"].map(value => ({dataset:{themeChoice:value},setAttribute(name,value){this[name]=value;}}));
  const root = {dataset:{}};
  const storage = {value:saved,getItem(){if(blocked)throw Error("blocked");return this.value;},setItem(_key,value){if(blocked)throw Error("blocked");this.value=value;}};
  const media = {matches:dark,addEventListener(_name,fn){this.change=fn;}};
  vm.runInNewContext(source, {localStorage:storage,document:{documentElement:root,querySelectorAll:()=>buttons,addEventListener:(name,fn)=>events[name]=fn},window:{matchMedia:()=>media,addEventListener:(name,fn)=>windowEvents[name]=fn}});
  return {root,storage,buttons,choose:value=>events["doskvol:theme"]({detail:value}),media,windowEvents};
}
test("device follows the color preference and updates dynamically",()=>{
 const app=boot({dark:true});assert.equal(app.root.dataset.theme,"dark");
 app.media.matches=false;app.media.change();assert.equal(app.root.dataset.theme,"light");
 assert.equal(app.buttons[2]["aria-pressed"],"true");
});
test("manual day overrides a dark device and survives a reload",()=>{
 const app=boot({dark:true});app.choose("day");app.media.change();
 assert.equal(app.root.dataset.theme,"light");assert.equal(app.storage.value,"day");
 assert.equal(boot({saved:app.storage.value,dark:true}).root.dataset.theme,"light");
});
test("manual night overrides a light device, and Cihaz returns to automatic",()=>{
 const app=boot();app.choose("night");assert.equal(app.root.dataset.theme,"dark");
 assert.equal(app.buttons[1]["aria-pressed"],"true");
 app.choose("device");assert.equal(app.root.dataset.theme,"light");
});
test("invalid stored values fall back to device; storage denial never blocks switching",()=>{
 assert.equal(boot({saved:"bogus",dark:true}).root.dataset.theme,"dark");
 const app=boot({blocked:true});app.choose("night");assert.equal(app.root.dataset.theme,"dark");
});
test("appearance synchronizes across tabs and responds to cleared storage",()=>{
 const app=boot();app.windowEvents.storage({key:"doskvol-appearance",newValue:"night"});
 assert.equal(app.root.dataset.theme,"dark");
 app.windowEvents.storage({key:null,newValue:null});assert.equal(app.root.dataset.theme,"light");
});
