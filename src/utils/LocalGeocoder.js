import Cesium from 'cesium/Cesium'

/**
 *@time: 2018/8/13下午5:21
 *@author:QingMings(1821063757@qq.com)
 *@desc: 实体geoCoder查询, 使用时需要 传入 viewer 和 需要匹配的数组
 *
 */
const LocalGeocoder = function () {
  this.viewer
  this.array = []
}
/**
 *@time: 2018/8/13下午5:35
 *@author:QingMings(1821063757@qq.com)
 *@desc: 重写 {Cesium.Geocode} 类的 geocode 方法，自己实现搜索实体功能
 *@param entityId 实体名称关键字
 */
LocalGeocoder.prototype.geocode = function (entityId) {
  if (!Cesium.defined(this.viewer)) {
    throw new Cesium.DeveloperError('LocalGeocoder.viewer 是必须的')
  }
  var matchArr = regexMatch(entityId, array)
  var result = matchArr.map(resObj => {
    var entityPosition = resObj.position.getValue(viewer.clock.currentTime)
    var cartographic = Cesium.Cartographic.fromCartesian(entityPosition)
    var longitudeStr = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
    var latitudeStr = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
    var endPosition = Cesium.Cartesian3.fromDegrees(Number(longitudeStr), Number(latitudeStr), 50.0)
    return {
      displayName: resObj.name,
      destination: endPosition
    }
  })
}

/**
 *@time: 2018/8/13下午5:24
 *@author:QingMings(1821063757@qq.com)
 *@desc: 从数组中匹配 包含关键字的项
 *@param literalString 关键字
 *@param targetArr  需要匹配的数组
 */
function regexMatch (literalString, targetArr) {
  var matchBin = []
  var oRegex = new RegExp(literalString)
  for (let i = 0; i < targetArr.length; i++) {
    var item = String(targetArr[i].name).search(oRegex)
    if (item > -1) {
      matchBin.push(targetArr[i])
    }
  }
  return matchBin
}

var viewer
var array = []

export default LocalGeocoder
