import { StringOption } from 'necord'

export class FeedbackOptions {
  @StringOption({
    name: 'evaluation',
    description: 'Evaluation of support work',
    required: true,
    choices: [
      { name: '⭐', value: '1' },
      { name: '⭐⭐', value: '2' },
      { name: '⭐⭐⭐', value: '3' },
      { name: '⭐⭐⭐⭐', value: '4' },
      { name: '⭐⭐⭐⭐⭐', value: '5' },
    ],
  })
  evaluation: string

  @StringOption({
    name: 'message',
    description: 'Commentary',
    required: true,
    min_length: 1,
    max_length: 2000,
  })
  message: string
}
