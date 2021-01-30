<template>
  <div class="w-full h-full">
    <div class="flex w-full p-4">
      <q-breadcrumbs>
        <q-breadcrumbs-el to="/" label="Home" icon="home" />
        <q-breadcrumbs-el label="User Managments" icon="group" />
      </q-breadcrumbs>
    </div>
    <div class="flex w-full p-4">
      <h3 class="text-xl">User Management</h3>
    </div>
    <div class="flex w-full justify-start">
      <div class="w-1/4 px-4">
        <q-select
          @input="clear"
          outlined
          dense
          v-model="Countries"
          :options="websiteCountries"
          label="Countries"
        >
          <template v-slot:selected>
            <div v-if="Countries">
              <q-avatar color="primary" size="15px" text-color="white">
                <img :src="Countries.icon" />
              </q-avatar>
              {{ Countries.label }}
            </div>
            <div v-else></div>
          </template>
        </q-select>
      </div>
      <div class="w-1/4 px-4">
        <q-select
          outlined
          dense
          v-model="program"
          @input="getSubjects"
          :options="getProgramsByCountry"
          label="Programs"
        />
      </div>
      <div class="w-1/4 px-4">
        <q-select
          outlined
          dense
          v-model="subjects"
          :options="getProgramSubjects"
          multiple
          label="Subjects"
        />
      </div>
      <q-btn
        icon="search"
        color="primary"
        dense
        class="mr-4 px-2"
        @click="search"
        no-caps
      >Search</q-btn>

      <q-btn icon="add" dense color="primary" no-caps class="px-2" @click="addTa">Add</q-btn>
    </div>

    <div class="p-4">
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Country</th>
            <th class="text-left">Program</th>
            <th class="text-left">Subjects</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item) in getData"
            :key="item.id"
            @click="chooseTa=item.id"
            :class="chooseTa==item.id?'bg-gray-200':''"
          >
            <td class="py-4 capitalize">{{item.display_name}}</td>
            <td class="py-4">{{item.username}}</td>
            <td class="py-4">{{item.extra_info.country}}</td>
            <td class="py-4">{{item.extra_info.program}}</td>
            <td class="py-4" v-if="item.extra_info">
              <q-chip
                :style="`background-color:${sub.bgColor}`"
                class="text-white"
                v-for="(sub,index) in item.extra_info.subjects"
                :key="index"
              >{{sub.label}}</q-chip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.getPrograms();
    this.getTeacherAssistant();
  },
  data() {
    return {
      chooseTa: "",
      items: [
        {
          id: 1,
          name: "ashraf",
          email: "ashraf@abwaab.me",
          country: "",
          program: "",
          subject: [],
        },
        {
          id: 2,
          name: "abdullah",
          email: "abudllah@abwaab.me",
          country: "",
          program: "",
          subject: [],
        },
        {
          id: 3,
          name: "hamdi",
          email: "hamdi@abwaab.me",
          country: "",
          program: "",
          subject: [],
        },
        {
          id: 4,
          name: "hussien",
          email: "hussien@abwaab.me",
          country: "",
          program: "",
          subject: [],
        },
        {
          id: 5,
          name: "wajd",
          email: "wajd@abwaab.me",
          country: "",
          program: "",
          subject: [],
        },
      ],
      program: null,
      Countries: null,
      subjects: [],
      websiteCountries: [
        {
          id: 1,
          value: "JO",
          label: "Jordan",
          icon: require("../assets/flags/Jordan_flag.png"),
        },
        {
          id: 2,
          value: "PS",
          label: "Palestine",
          icon: require("../assets/flags/Palestine_flag.png"),
        },
        {
          id: 3,
          value: "EG",
          label: "Egypt",
          icon: require("../assets/flags/Egypt_flag.png"),
        },
      ],
    };
  },
  methods: {
    ...mapActions(["getPrograms", "getProgramSubject", "getTeacherAssistant", "assignTA"]),
    search() {
      var searchResult = [];
      debugger
      if(this.Countries){
        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].extra_info.countryId === this.Countries.value) {
            searchResult.push(this.items[index]);
          }
        }
        this.items = searchResult;
      }else if(this.program){
        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].extra_info.programId === this.program.value) {
            searchResult.push(this.items[index]);
          }
        }
        this.items = searchResult;
      }else{
        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].extra_info.subjects.id === this.subjects.value) {
            searchResult.push(this.items[index]);
          }
        }
        this.items = searchResult;
      }
      if(!this.items.length){
        this.Countries = ""
        this.program = ""
        this.subjects = ""
        this.$q.notify({
          message: "No Data Found",
          color: "negative",
          icon: "warning"
        });
        this.$forceUpdate()
        return;
      }
    },
    addTa() {
      let data = {
        id: this.chooseTa,
        extra_info:{
          country: this.Countries.label,
          countryId: this.Countries.value,
          program: this.program.label,
          programId:this.program.value,
          subjects: this.subjects
        }
      }
      this.assignTA(data)
    },
    getSubjects() {
      this.getProgramSubject(this.program.value);
    },
    clear() {
      this.program = null;
      this.subjects = null;
    },
  },
  computed: {
    ...mapGetters(["programs", "ProgramSubjects", "teaching_assistant"]),
    getProgramsByCountry() {
      if (this.Countries) {
        let programs = [];
        this.programs.filter((program) => {
          if (program.country == this.Countries.value) {
            programs.push({
              id: program.id,
              label: program.title_ar,
              value: program.id,
            });
          }
        });
        return programs;
      }
    },
    getProgramSubjects() {
      this.subjects = null;
      let subjects = [];
      this.ProgramSubjects.filter((subject) => {
        subjects.push({
          id: subject.id,
          label: subject.title_ar,
          value: subject.id,
          bgColor: subject.bgColor,
        });
      });
      return subjects;
    },
    getData(){
      return this.items =  this.teaching_assistant;
    }
  },
};
</script>
<style scoped>
</style>
