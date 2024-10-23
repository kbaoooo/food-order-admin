
import './Add.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Add() {
    const url = 'http://localhost:4000/api/menu';

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        category: 'Salad',
        price: ''
    });

    const handleChange = (e) => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', Number(data.price));
        formData.append('image', image);

        const response = await axios.post(`${url}/add-food`, formData)
        const result = response.data;

        if(result.success){
            setData({
                name: '',
                description: '',
                category: 'Salad',
                price: ''
            });
            setImage(false);
            toast.success(result.message, {
                pauseOnHover: false,
            });
        } else {
            toast.error(result.message, {
                pauseOnHover: false,
            });
        }
    }

  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>Tải ảnh lên</p>
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required/>
            </div>
            <div className='add-product-name flex-col'>
                <p>Tên món ăn</p>
                <input onChange={handleChange} value={data.name} type="text" name='name' placeholder='Nhập tên món' required/>
            </div>
            <div className="add-product-description flex-col">
                <p>Miêu tả</p>
                <textarea onChange={handleChange} value={data.description} name='description' rows={6} placeholder='Viết mô tả' required/>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Phân loại</p>
                    <select onChange={handleChange} value={data.category} name='category' required>
                        <option value="Salad">Salad</option>
                        <option value="Món cuộn">Món cuộn</option>
                        <option value="Đồ tráng miệng">Đồ tráng miệng</option>
                        <option value="Bánh mì">Bánh mì</option>
                        <option value="Bánh ngọt">Bánh ngọt</option>
                        <option value="Đồ chay">Đồ chay</option>
                        <option value="Mì Ống">Mì Ống</option>
                        <option value="Mì">Mì</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Giá</p>
                    <input onChange={handleChange} value={data.price} type="number" name='price' placeholder='Giá' required/>
                </div>
            </div>
            <button type='submit' className='add-btn'>Thêm</button>
        </form>
    </div>
  )
}
