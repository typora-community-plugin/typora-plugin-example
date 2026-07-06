// Remove the line below if you don't need custom styles
import './style.scss'
import { Plugin } from '@typora-community-plugin/core'


export default class extends Plugin {

  onload() {
    alert('hello, typora')
  }

  onunload() {
    // dispose resources, like events, processes...
  }
}
