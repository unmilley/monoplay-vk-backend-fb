import { Chance, Company, Fields, Railroad, Street } from 'types'
import * as chance from './chance.json'
import * as companies from './companies.json'
import * as railroads from './railroads.json'
import * as streets from './streets.json'

export const OriginalEdition: Fields = {
  streets: <Street>(<unknown>streets.streets),
  chance: <Chance>chance.chance,
  railroads: <Railroad[]>railroads.railroads,
  companies: <Company[]>companies.companies,
}
