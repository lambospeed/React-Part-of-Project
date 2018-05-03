export interface ImportedDatasetType {
  dataset_name: string, count: number, entries: Array<DatasetEntriesType>
}

export interface DatasetEntriesType {
  height: number,
  id: number,
  latitude: any,
  longitude: any,
  owner_id: number,
  owner_name: string,
  owner_url: string,
  photo_file_url: string,
  title: string,
  upload_date: string,
  url: string,
  width: number
}

export interface DatasetType {
  id: number
  datasetName: string
  url: string
}


export const DATASETS: Array<DatasetType> = [
  {
    id: 1,
    datasetName: 'dataset 1',
    url: '/dataset/dataset1.json'
  },
  {
    id: 2,
    datasetName: 'dataset 2',
    url: '/dataset/dataset2.json'
  },
  {
    id: 3,
    datasetName: 'video cameras',
    url: '/dataset/shodan.json'
  },
  {
    id: 4,
    datasetName: 'tshirt factories',
    url: '/dataset/tshirt_factories.json'
  }  
]
