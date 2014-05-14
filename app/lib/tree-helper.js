'use strict';

function getClass(height){
  if(height === -1){
    return 'stump';
  }
  if(height === 0){
    return 'seed';
  }
  if(height <= 12){
    return 'sapling';
  }
  if(height <= 48){
    return 'treenager';
  }
  return 'adult';
}

exports.getClass = getClass;  //means you're exporting a function
