import el from './common/dom-el.js'
import runtime from '../core/runtime.js'
import Promise from 'bluebird'

// container DOM element
var mainEl
if (runtime.isBrowser) runtime.domReady(function(){
  mainEl = el('<div>',{ class: 'io3d-message-list' }).appendTo('body')
})

// main
function message (message, expire, type) {
  runtime.assertBrowser()

  // do nothing if there is no message
  if (!message || message === '') return Promise.resolve()
  // default expire value is 4 secs
  var expire = expire !== undefined ? expire : 4000 // ms
  // default message type
  var type = type || 'neutral' // can be: neutral, success, warning, error

  // internals
  var isClosed = false

  // create main html element
  var messageEl = el('<div>',{
    class: 'message'
  }).prependTo(mainEl).hide()
  el('<div>',{ class: 'spacer' }).appendTo(messageEl)

  // insert content
  var contentEl = el('<div>',{
    class: 'text '+type
  }).appendTo(messageEl)
  el.isElement(message) ? contentEl.append(message) : contentEl.innerHTML = message

  // create message object
  var resolve
  var result = new Promise(function(resolve_, reject_){
    resolve = resolve_
  })

  // close method
  result.close = function close () {
    if (isClosed) return
    isClosed = true
    messageEl.toggleSlide()
    setTimeout(function(){
      messageEl.remove()
    }, 500)
    resolve()
  }

  // init
  messageEl.toggleSlide()

  // close message on expire
  if (expire) setTimeout(result.close, expire)

  // expose message object
  return result

}

// shortcuts for convenience
message.success = function createErrorMessage (str, expire) {
  return message (str, expire, 'success')
}
message.warning = function createErrorMessage (str, expire) {
  return message (str, expire, 'warning')
}
message.error = function createErrorMessage (str, expire) {
  return message (str, expire, 'error')
}

export default message