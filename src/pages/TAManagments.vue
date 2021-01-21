<template>
  <div class="w-full h-full">
    <div class="flex w-full p-4">
      <q-breadcrumbs>
        <q-breadcrumbs-el to="/" label="Home" icon="home" />
        <q-breadcrumbs-el label="User Managments" icon="people_outline" />
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
      <!-- maltiple
          use-chips
      stack-label-->
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
      <button class="bg-blue-300 p-2 rounded px-4 text-white mr-4" @click="search">Search</button>

      <button class="bg-blue-300 p-2 rounded px-4 text-white" @click="addTa">Add</button>
    </div>

    <div class="p-4">
      <div class="flex justify-between text-xl mb-4">
        <div class="w-1/5">Name</div>
        <div class="w-1/5">Email</div>
        <div class="w-1/5">Country</div>
        <div class="w-1/5">Program</div>
        <div class="w-1/5">Subject</div>
      </div>
      <div v-for="(item) in items" :key="item.id">
        <div
          class="flex justify-between cursor-pointer border-2 mb-2 border-light-blue-500"
          @click="chooseTa=item.id"
          :class="chooseTa==item.id?'bg-gray-200':''"
        >
          <div class="w-1/5">{{item.name}}</div>
          <div class="w-1/5">{{item.email}}</div>
          <div class="w-1/5">{{item.country}}</div>
          <div class="w-1/5">{{item.program}}</div>
          <div class="w-1/5">
            <div class v-for="(sub,index) in item.subject" :key="index">{{sub.label}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.getPrograms();
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
          subject: []
        },
        {
          id: 2,
          name: "abdullah",
          email: "abudllah@abwaab.me",
          country: "",
          program: "",
          subject: []
        },
        {
          id: 3,
          name: "hamdi",
          email: "hamdi@abwaab.me",
          country: "",
          program: "",
          subject: []
        },
        {
          id: 4,
          name: "hussien",
          email: "hussien@abwaab.me",
          country: "",
          program: "",
          subject: []
        },
        {
          id: 5,
          name: "wajd",
          email: "wajd@abwaab.me",
          country: "",
          program: "",
          subject: []
        }
      ],
      program: null,
      Countries: null,
      subjects: [],
      websiteCountries: [
        {
          id: 1,
          value: "JO",
          label: "Jordan",
          icon: require("../assets/flags/Jordan_flag.png")
        },
        {
          id: 2,
          value: "PS",
          label: "Palestine",
          icon: require("../assets/flags/Palestine_flag.png")
        },
        {
          id: 3,
          value: "EG",
          label: "Egypt",
          icon: require("../assets/flags/Egypt_flag.png")
        }
      ]
    };
  },
  methods: {
    search() {
      var searchResult = [];
      for (let index = 0; index < this.items.length; index++) {
        console.log("asfa", this.items[index].program, this.program.label);

        if (this.items[index].program === this.program.label) {
          console.log("yesss");
          searchResult.push(this.items[index]);
        }
      }
      this.items = searchResult;
      console.log("ite", this.items);
    },
    addTa() {
      console.log("tsat");
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].id == this.chooseTa) {
          this.items[index].country = this.Countries.label;
          this.items[index].program = this.program.label;

          this.items[index].subject = this.subjects;
          console.log("this.items[index].subject", this.items[index].subject);
        }
      }
    },

    ...mapActions(["getPrograms", "getProgramSubject"]),
    getSubjects() {
      this.getProgramSubject(this.program.value);
    },
    clear() {
      this.program = null;
      this.subjects = null;
    }
  },
  computed: {
    ...mapGetters(["programs", "ProgramSubjects"]),
    getProgramsByCountry() {
      if (this.Countries) {
        let programs = [];
        this.programs.filter(program => {
          if (program.country == this.Countries.value) {
            programs.push({
              id: program.id,
              label: program.title_ar,
              value: program.id
            });
          }
        });
        return programs;
      }
    },
    getProgramSubjects() {
      this.subjects = null;
      let subjects = [];
      this.ProgramSubjects.filter(subject => {
        subjects.push({
          id: subject.id,
          label: subject.title_ar,
          value: subject.id
        });
      });
      return subjects;
    }
  }
};
</script>
<style scoped>
</style>
