import XMLFormatter from 'xml-formatter'

function formatXML (xmlString, space = '    ') {
  let options = { indentation: space, collapseContent: true }
  let formattedXml = XMLFormatter(xmlString, options)
  return formattedXml
}

function formatJSON (jsonString, space = '  ') {
  let jsonObj
  try {
    jsonObj = JSON.parse(jsonString)
  } catch (e) {
    return ''
  }
  return JSON.stringify(jsonObj, null, space)
}

export default {
  install (Vue) {
    Vue.prototype.$formatXML = formatXML
    Vue.prototype.$formatJSON = formatJSON
  }
}
