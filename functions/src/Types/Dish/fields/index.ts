import {GraphQLString} from 'graphql';

import {Ingredient} from '../../../Types'

export const id = {
  type: GraphQLString,
  description: 'Dish ID',
}

export const name = {
  type: GraphQLString,
  description: 'Dish name',
}

export const ingredients = Ingredient.resolvers.getIngredient
