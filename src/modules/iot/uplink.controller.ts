import { Body, Controller, Logger, Param, Post } from '@nestjs/common';

import { UpdateDatastreamDto } from './dtos/update-data-stream.dto';
import { UpdateDeviceInfoDto } from './dtos/update-device-info.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';

@Controller('uplink')
export class UplinkController {
  private readonly logger = new Logger(UplinkController.name);

  @Post('ds/:datastream')
  updateDatastream(
    @Param('datastream') datastream: string,
    @Body() updateDatastreamDto: UpdateDatastreamDto,
  ): string {
    // Logic to update the datastream value
    // Example: this.datastreamService.updateValue(datastream, updateDatastreamDto.value);
    return `Datastream ${datastream} updated with value ${updateDatastreamDto.value}`;
  }

  @Post('ds/:datastream/prop/:property')
  updateProperty(
    @Param('datastream') datastream: string,
    @Param('property') property: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): string {
    // Logic to update the widget property
    // Example: this.widgetService.updateProperty(datastream, property, updatePropertyDto.value);
    return `Property ${property} of Datastream ${datastream} updated with value ${updatePropertyDto.value}`;
  }

  @Post('info/mcu')
  updateDeviceInfo(@Body() updateDeviceInfoDto: UpdateDeviceInfoDto): string {
    // Step 4: Service Logic (Pseudocode)
    // this.mcuService.updateDeviceInfo(updateDeviceInfoDto);
    this.logger.warn(
      'Device information updated successfully',
      updateDeviceInfoDto,
    );

    // Step 5: Response
    return 'Device information updated successfully';
  }
}
