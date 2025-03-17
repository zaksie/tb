export interface FeatureModel {
  name: string
  image?: string
  description?: string
  path?: string[] | string
  queryParams?: {[key: string]: string}
  children?: FeatureModel[]
}
