
export default class TreverseFileTree {
    #FileTree = []
    #allowed_events = ['drop', 'change']
    /**
         @param {DocumentEvent | FileList} Event
    */
    constructor(Event) {
        if(Event instanceof FileList) this.#handlePathArrayOfFile(Event)
        else if(!this.#isEvent(Event)) throw this.#isNotDomEvent()
        else if(!this.#allowed_events.includes(Event.type)) throw this.#isNotAllowedEvent()
        else if(Event.type === 'change') this.#handlePathArrayOfFile(Event.target.files)
        else  /* Valid html drop event */ this.#getFile(Event) 
    }
    /**
     * @getter @return {Array<File>}
     */
    get files() { return this.#FileTree } 
    /**
     * @param {object} Event 
     * @returns {boolean}  
     */
    #isEvent = Event => {
      let txt, es=false;
      txt = Object.prototype.toString.call(Event).split('').reverse().join('');
      es = (txt.indexOf("]tnevE") == 0)? true: false; // Firefox, Opera, Safari, Chrome
      if(!es){
          txt = Event.constructor.toString().split('').reverse().join('');
          es = (txt.indexOf("]tnevE") == 0)? true: false; // MSIE
      } return es }
    /**Throwables
     * @returns {String as Exeption}
     */
    #isNotDomEvent = () => { return {description : 'Event is not HTML DOM EVENT'}}
    #isNotAllowedEvent = () => { return {description : 'Event is not valid EVENT'}}
    
     /**
      * @read fileList webkitGetAsEntry
        @param {DocumentEvent} Event
    */
    #getFile = Event => {
      let items = Event.dataTransfer.items;
      for (let i=0; i<items.length; i++) {  const item = items[i].webkitGetAsEntry();
        if (item) { this.#traverseFileTree(item) }
      }
    }
    /**
        @param {File | Directory} item 
        @param {String} path
        @returns {File}
    */
    #traverseFileTree = function (item, path = ""){
      path = path || ""
      if (item.isFile) {
        /**
         * @callback @param {File} file 
         */
        item.file(function(file) {
          file.path = path; return this.#FileTree.push(file) }.bind(this))
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        /**
         * @callback @param {Directory} entries 
         */
        dirReader.readEntries(function(entries) { 
          for (let i=0; i<entries.length; i++) { this.#traverseFileTree(entries[i], path + item.name + "/") }
        }.bind(this))
      }
    }
    /**
     * @param {FileList} Files 
     */
    #handlePathArrayOfFile = (Files) => {
          for(File of Array.from(Files)) {
             let path =  File.webkitRelativePath.split('/')
                 path.pop()
                 path = path.join('')
              File.path = path
              this.#FileTree.push(File)
          }
    }

}

