import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          return cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  upload(@Param('id') id: string, @UploadedFile() file) {
    return this.productsService.uploadImage(+id, file.originalname);
  }

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.productsService.getAllProducts(limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.getOneProduct(+id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }
}
