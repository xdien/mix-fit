import { PrimaryColumn } from 'typeorm';

import { StringFieldOptional } from '../../../decorators';

export class RentalAgreementsDto {
  @PrimaryColumn()
  agreementId?: string;

  @StringFieldOptional({ nullable: false })
  rentersId: string;

  @StringFieldOptional({ nullable: false })
  deviceOwnerId: string;

  constructor(rentalAgreementsDto: RentalAgreementsDto) {
    this.rentersId = rentalAgreementsDto.rentersId;
    this.deviceOwnerId = rentalAgreementsDto.deviceOwnerId;
  }
}
