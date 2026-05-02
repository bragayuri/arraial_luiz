/**
 * queries.js
 * Todas as operações GraphQL do frontend.
 */

import { gql } from '@apollo/client/core'

// ── Fragments ────────────────────────────────────────────
export const GUEST_FIELDS = gql`
  fragment GuestFields on Guest {
    id
    name
    phone
    email
    confirmed
    plusOne
    notes
  }
`

export const ITEM_FIELDS = gql`
  fragment ItemFields on Item {
    id
    name
    description
    quantity
    category
    claimedAt
    claimedBy {
      id
      name
    }
  }
`

// ── Queries ──────────────────────────────────────────────

/** Busca os dados de um convidado específico + seus itens reivindicados */
export const GET_GUEST = gql`
  ${GUEST_FIELDS}
  query GetGuest($id: ID!) {
    guest(id: $id) {
      ...GuestFields
      items {
        id
        name
        category
        claimedAt
      }
    }
  }
`

/** Lista todos os itens disponíveis (não reivindicados) */
export const GET_AVAILABLE_ITEMS = gql`
  ${ITEM_FIELDS}
  query GetAvailableItems {
    availableItems {
      ...ItemFields
    }
  }
`

/** Lista todos os itens (para admin ou visão completa) */
export const GET_ALL_ITEMS = gql`
  ${ITEM_FIELDS}
  query GetAllItems {
    items {
      ...ItemFields
    }
  }
`

/** Resumo da festa */
export const GET_PARTY_SUMMARY = gql`
  query GetPartySummary {
    partySummary {
      totalGuests
      confirmedGuests
      totalItems
      claimedItems
      availableItems
    }
  }
`

// ── Mutations ────────────────────────────────────────────

/** Confirma presença do convidado */
export const CONFIRM_GUEST = gql`
  ${GUEST_FIELDS}
  mutation ConfirmGuest($id: ID!) {
    confirmGuest(id: $id) {
      ...GuestFields
    }
  }
`

/** Convidado reivindica um item */
export const CLAIM_ITEM = gql`
  ${ITEM_FIELDS}
  mutation ClaimItem($itemId: ID!, $guestId: ID!) {
    claimItem(itemId: $itemId, guestId: $guestId) {
      ...ItemFields
    }
  }
`

/** Convidado libera um item */
export const UNCLAIM_ITEM = gql`
  ${ITEM_FIELDS}
  mutation UnclaimItem($itemId: ID!) {
    unclaimItem(itemId: $itemId) {
      ...ItemFields
    }
  }
`

// ── Admin Queries ─────────────────────────────────────────

/** Lista todos os convidados com seus itens reivindicados (para o admin) */
export const GET_ALL_GUESTS = gql`
  ${GUEST_FIELDS}
  query GetAllGuests {
    guests {
      ...GuestFields
      items {
        id
        name
        category
        quantity
      }
    }
  }
`

// ── Admin Mutations ───────────────────────────────────────

/** Cria um novo convidado (admin) */
export const CREATE_GUEST = gql`
  ${GUEST_FIELDS}
  mutation CreateGuest($input: CreateGuestInput!) {
    createGuest(input: $input) {
      ...GuestFields
    }
  }
`

/** Atualiza um convidado (admin) */
export const UPDATE_GUEST = gql`
  ${GUEST_FIELDS}
  mutation UpdateGuest($id: ID!, $input: UpdateGuestInput!) {
    updateGuest(id: $id, input: $input) {
      ...GuestFields
    }
  }
`

/** Remove um convidado (admin) */
export const DELETE_GUEST = gql`
  mutation DeleteGuest($id: ID!) {
    deleteGuest(id: $id)
  }
`

/** Cria um novo item na lista de insumos (admin) */
export const CREATE_ITEM = gql`
  ${ITEM_FIELDS}
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      ...ItemFields
    }
  }
`

/** Atualiza um item (admin) */
export const UPDATE_ITEM = gql`
  ${ITEM_FIELDS}
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      ...ItemFields
    }
  }
`

/** Remove um item (admin) */
export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`
