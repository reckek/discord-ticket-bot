import { COLORS } from '@/constants'
import { ConfigService } from '@nestjs/config'
import { ChatInputCommandInteraction, EmbedBuilder, inlineCode } from 'discord.js'

export class PaymentsService {
  onUseCommand(interaction: ChatInputCommandInteraction, _configService: ConfigService) {
    const walletNumber = inlineCode(_configService.get('PRIVATE_DATA_WALLET_NUMBER'))
    const nameCrypto = inlineCode(_configService.get('PRIVATE_DATA_NAME_CRYPTO'))
    const networkName = inlineCode(_configService.get('PRIVATE_DATA_NETWORK_NAME'))
    const email = inlineCode(_configService.get('PRIVATE_DATA_EMAIL'))

    const embed = new EmbedBuilder({
      title: 'Payments',
      fields: [
        {
          name: 'Crypto',
          value: `Wallet number: ${walletNumber}\nCrypto name: ${nameCrypto}\nNetwork name: ${networkName}`,
          inline: false,
        },
        {
          name: 'Paypal',
          value: `${email} | Types: Friends and Family`,
          inline: false,
        },
      ],
      color: COLORS.INFO,
    })

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    })
  }
}
