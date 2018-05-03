var fs = require('fs');
var parsedJSON = require(`./${process.argv[2]}`);
var dataset = parsedJSON.entries // .entries json loading
var duplicate, clearDataset;
duplicate = dataset.filter((li, idx, self) => 
  !(self.map(itm => itm.longitude).indexOf(li.longitude) === idx) && 
  !(self.map(itm => itm.latitude).indexOf(li.latitude) === idx))
clearDataset = dataset.filter((li, idx, self) => 
  (self.map(itm => itm.longitude).indexOf(li.longitude) === idx) && 
  (self.map(itm => itm.latitude).indexOf(li.latitude) === idx))

console.log('Duplicate and Empty objects are: ', duplicate);

/**
 * Prepare clearDataset
 * @return clearDataset object
 */
clearDataset = {
  "dataset_name": parsedJSON.dataset_name,
  "count": parsedJSON.count,
  "entries": clearDataset
}

/**
 * Save clearDataset to file
 * @return `clear_{filename}.json`
 */
fs.writeFile(`clear_${process.argv[2]}`, JSON.stringify(clearDataset,null,2), (err) => {
    if(err) throw err;
});

