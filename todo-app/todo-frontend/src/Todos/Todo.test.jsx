import { render, screen } from '@testing-library/react'
import Todo from './Todo'
import {vi} from 'vitest'

test('renders content', () => {
  const todo = {
    text: 'Component testing is done with react-testing-library',
    done: false
  }

  const onClickDelete = vi.fn()
  const onClickComplete = vi.fn()

  render(<Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete}/>)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})