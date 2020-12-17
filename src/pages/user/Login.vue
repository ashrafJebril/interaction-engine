<template>
  <div class="lg:flex">
    <div class="lg:w-1/2 xl:max-w-screen-sm">
      <div class="py-12 bg-blue-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
        <div class="cursor-pointer flex items-center">
          <div>
            <img src="../../assets/img/logo.png" class="h-12" alt="">
          </div>
          <div class="text-2xl text-blue-800 tracking-wide ml-2 font-semibold">Abwaab Interaction Engine</div>
        </div>
      </div>
      <div class="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
        <h2
          class="text-center text-4xl text-blue-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold"
        >Log in</h2>
        <div class="mt-12">
          <form>
            <div>
              <div class="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
              <input
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                type
                placeholder="mike@gmail.com"
              />
            </div>
            <div class="mt-8">
              <div class="flex justify-between items-center">
                <div class="text-sm font-bold text-gray-700 tracking-wide">Password</div>
              </div>
              <input
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                type
                placeholder="Enter your password"
              />
            </div>
            <div class="mt-10">
              <button
                class="bg-blue-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg"
              >Log In</button>
            </div>
          </form>

        </div>
      </div>
    </div>
    <div class=" lg:flex items-center justify-center bg-blue-100 flex-1 h-screen">
      <div class="max-w-xs transform duration-200 hover:scale-110 ">
        <img src="../../assets/img/Access.svg"  alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style type="text/css">
.st0 {
  fill: none;
  stroke: currentColor;
  stroke-width: 20;
  stroke-linecap: round;
  stroke-miterlimit: 3;
}
</style>
