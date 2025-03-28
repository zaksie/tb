export interface FeatureAction {
  title: string
  path: string
}
export interface FeatureModel {
  name: string
  image?: string
  description?: string[]
  public?: boolean
  disabled?: boolean
  path?: string[] | string
  queryParams?: {[key: string]: string}
  children?: FeatureModel[]
  internalNavigation? : boolean
  actions?: FeatureAction[]
  isDisabled?: () => boolean
}
