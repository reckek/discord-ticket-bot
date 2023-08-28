import { COLORS } from '@/constants/colors'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatInputCommandInteraction, EmbedBuilder, inlineCode } from 'discord.js'

@Injectable()
export class PaymentsService {
  private _logger = new Logger(PaymentsService.name)

  constructor(@Inject(ConfigService) private readonly _configService: ConfigService) {}

  onUseCommand(interaction: ChatInputCommandInteraction, _configService: ConfigService) {
    try {
      this._logger.log('-'.repeat(30))
      this._logger.log('Command start: Payments')

      const walletNumber = inlineCode(this._configService.get('PRIVATE_DATA_WALLET_NUMBER'))
      const nameCrypto = inlineCode(this._configService.get('PRIVATE_DATA_NAME_CRYPTO'))
      const networkName = inlineCode(this._configService.get('PRIVATE_DATA_NETWORK_NAME'))
      const email = inlineCode(this._configService.get('PRIVATE_DATA_EMAIL'))

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

      this._logger.log('Command end: Payments')
    } catch (error) {
      this._logger.error(error)
    }
  }
}
