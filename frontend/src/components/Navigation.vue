<template>
    <div class="container">
        <div class="left-container">
            <span><i class='bx bx-dots-vertical'></i></span>
            <div class="search-container">
                <i class="bx bx-search search-icon"></i>
                <input type="text" class="search-input" placeholder="Search contacts and messages...">
            </div>
        </div>
        <div class="right-container">
            <span><i class='bx bxs-bell'></i></span>
            <img src="/avatar.png">
            <span><i class='bx bx-chevron-down'></i></span>
        </div>
        
    </div>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style>
.container {
    background-color: #2c3a57;
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.left-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding-left: 20px;

    font-size: 20px;
    color: #d1dbee;
}

.right-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding-right: 20px;
    font-size: 18px;

    color: #d1dbee;
}

.right-container > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.search-container {
  position: relative;
  width: 400px;
}

.search-input {
  width: 100%;
  padding: 5px 5px 5px 40px;
  border: none;
  border-radius: 25px;
  background-color: #424d67;
  color: white;
  appearance: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
}

.search-input::placeholder {
    color: #cccccc;
}

.search-icon {
  position: absolute;
  font-size: 18px;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #cccccc;
  cursor: pointer;
}



</style>