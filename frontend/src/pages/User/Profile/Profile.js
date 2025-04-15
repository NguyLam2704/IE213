import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
// import dotenv from "dotenv";
import "./Profile.css";
// dotenv.config();
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, updateProfileField, updateAvatar, setIsEditing } from '../../../features/user/userSlice';




function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);
  const isEditing = useSelector(state => state.user.isEditing);
  const status = useSelector(state => state.user.status);
  const error = useSelector(state => state.user.error);

  useEffect(() => {
    const user_id = 1;
    dispatch(fetchProfile(user_id));
  }, [dispatch]);
  
  const handleInputChange = (e) => {
    if (!profile) return;
    const { name, value } = e.target;
    dispatch(updateProfileField({ name, value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(updateAvatar(imageUrl));
    }
  };
  const toggleEdit = () => {
    dispatch(setIsEditing(!isEditing));
  };
  return (
    <div className="profile-container">
      {/* Phần thông tin */}
      <div className="profile-info">
        <h2>Thông tin tài khoản</h2>
        <div className="profile-field">
          <label>Họ và tên:</label>
          {isEditing ? (
            <input type="text" name="name" value={profile.name} onChange={handleInputChange} />
          ) : (
            <span>{profile.name}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{profile.email}</span>
        </div>
        <div className="profile-field">
          <label>Số điện thoại:</label>
          {isEditing ? (
            <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} />
          ) : (
            <span>{profile.phone}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Giới tính:</label>
          {isEditing ? (
            <div className="gender-options">
              <label>
                <input type="radio" name="gender" value="male" checked={profile.gender === "male"} onChange={handleInputChange} />
                Nam
              </label>
              <label>
                <input type="radio" name="gender" value="female" checked={profile.gender === "female"} onChange={handleInputChange} />
                Nữ
              </label>
              <label>
                <input type="radio" name="gender" value="other" checked={profile.gender === "other"} onChange={handleInputChange} />
                Khác
              </label>
            </div>
          ) : (
            <span >{profile.gender === "male" ? "Nam" : profile.gender === "female" ? "Nữ" : "Khác"}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Ngày sinh:</label>
          {isEditing ? (
            <input type="date" name="dob" value={profile.dob} onChange={handleInputChange} />
          ) : (
            <span>{profile.dob}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Địa chỉ:</label>
          {isEditing ? (
            <input type="text" name="address" value={profile.address} onChange={handleInputChange} />
          ) : (
            <span>{profile.address}</span>
          )}
        </div>

        {/* Button chỉnh sửa & lưu */}
        <div className="profile-actions">
            {isEditing ? (
            <button className="save-btn" onClick={() => setIsEditing(false)}>
                <FontAwesomeIcon icon={faSave} /> Lưu
            </button>
            ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
            </button>
            )}
        </div>

      </div>

      {/* Phần avatar */}
      <div className="profile-avatar">
        <div className="avatar-container">
          <img src={profile.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq0Ew26loGLlA5Eg0toc7PicPn5JoMu6t6Nw&s"} alt="Avatar" className="avatar" />
          {isEditing && <input type="file" accept="image/*" onChange={handleFileChange} />}
        </div>
      </div>
      
    
      
    </div>
  );
}

export default Profile;
