import {
  ImportedDatasetType, DatasetEntriesType
} from './index'

/**
 * Function for format *dataset*.
 * It adds up common attributes, id, parse string-based long/lat to float number 
 * and filters through collection of empty coordinates
 * @param {number} id MarkerId
 */
export const dataFormatter = ((dataset: ImportedDatasetType): DatasetEntriesType[] => {
  let formattedData: DatasetEntriesType[] = dataset.entries.map((entry: DatasetEntriesType, index: number) => {
    entry.latitude = (entry.latitude !== "") ? parseFloat(entry.latitude) : 0;
    entry.longitude = (entry.longitude !== "") ? parseFloat(entry.longitude) : 0;
    // Common attributes for marker
    // entry.title
    // entry.url 
    // We could write custom formatter by dataset_name
    // if (dataset.dataset_name == 'dataset 4') {
    // entry.title = titleCalculation...
    //}
    entry.id = index;
    return entry;
  }).filter((entry: DatasetEntriesType) => entry.latitude !== 0);
  return formattedData;
})