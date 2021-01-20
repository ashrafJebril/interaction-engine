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
          stack-label -->
      <div class="w-1/4 px-4">
        <q-select
          outlined
          dense
          v-model="subjects"
          :options="getProgramSubjects"
          label="Subjects"
        />
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
      program: null,
      Countries: null,
      subjects: null,
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
    ...mapActions(["getPrograms", "getProgramSubject"]),
    getSubjects() {
      this.getProgramSubject(this.program.value);
    },
    clear() {
      this.program = null;
      this.subjects = null;
    },
  },
  computed: {
    ...mapGetters(["programs", "ProgramSubjects"]),
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
        });
      });
      return subjects;
    },
  },
};
</script>
<style scoped>
</style>
