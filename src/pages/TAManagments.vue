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
        >Search</q-btn
      >
    </div>

    <div class="p-4 flex">
      <table class="table-auto w-1/2">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in getData"
            :key="item.id"
            @click="chooseTa = item.id"
            :class="chooseTa == item.id ? 'bg-gray-200' : ''"
          >
            <td class="py-4 capitalize">{{ item.display_name }}</td>
            <td class="py-4">{{ item.username }}</td>
            <td class="py-4">
              {{ item.user_type == "teaching_assistant" ? "TA" : "Teacher" }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="w-1/2">
        <q-card v-if="chooseTa" flat bordered class="my-card mx-2 bg-grey-1">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img
                  :src="selectedUser && selectedUser.avatar_url"
                  @error="getImage"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{
                selectedUser && selectedUser.display_name
              }}</q-item-label>
              <q-item-label caption>
                {{ selectedUser && selectedUser.username }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                icon="settings"
                @click="edit = !edit"
                flat
                round
                color="primary"
              ></q-btn>
            </q-item-section>
          </q-item>

          <q-card-section>
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <th class="text-center">Country</th>
                  <th class="text-center">Program</th>
                  <th class="text-center">Subjects</th>
                  <th class="text-center">Can Delete</th>
                  <th class="text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="selectedUser.extra_info">
                  <td class="py-4 text-center">
                    {{
                      selectedUser.extra_info && selectedUser.extra_info.country
                    }}
                  </td>
                  <td class="py-4 text-center">
                    {{
                      selectedUser.extra_info && selectedUser.extra_info.program
                    }}
                  </td>
                  <td class="py-4 text-center" v-if="selectedUser.extra_info">
                    <q-chip
                      :style="`background-color:${sub.bgColor}`"
                      class="text-white"
                      v-for="(sub, index) in selectedUser.extra_info.subjects"
                      :key="index"
                      >{{ sub.label }}</q-chip
                    >
                  </td>
                  <td class="text-center">
                    <q-icon
                      v-if="
                        selectedUser.extra_info &&
                        selectedUser.extra_info.canDelete
                      "
                      name="check_circle_outline"
                      class="text-green"
                      style="font-size: 2em"
                    ></q-icon>
                    <q-icon
                      v-else
                      class="text-red"
                      name="highlight_off"
                      style="font-size: 2em"
                    ></q-icon>
                  </td>
                  <td>
                    <q-btn
                      icon="settings"
                      @click="edit = !edit"
                      flat
                      round
                      color="primary"
                    ></q-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="edit">
      <q-card style="width: 400px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Edit</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="flex flex-col w-full justify-start">
            <div class="w-full py-2">
              <q-select
                @input="clear"
                outlined
                v-model="selectedCountries"
                :options="websiteCountries"
                label="Countries"
                :hint="`Current Country: ${
                  selectedUser &&
                  selectedUser.extra_info &&
                  selectedUser.extra_info.country
                }`"
              >
                <template v-slot:selected>
                  <div v-if="selectedCountries">
                    <q-avatar color="primary" size="15px" text-color="white">
                      <img :src="selectedCountries.icon" />
                    </q-avatar>
                    {{ selectedCountries.label }}
                  </div>
                  <div v-else></div>
                </template>
              </q-select>
            </div>
            <div class="w-full py-2">
              <q-select
                outlined
                v-model="selectedProgram"
                @input="getSubjects"
                :options="getSelectedProgramsByCountry"
                label="Programs"
                :hint="`Current Program: ${
                  selectedUser &&
                  selectedUser.extra_info &&
                  selectedUser.extra_info.program
                }`"
              />
            </div>
            <div class="w-full py-2">
              <q-select
                outlined
                v-model="selectedSubjects"
                :options="getSelectedProgramSubjects"
                multiple
                label="Subjects"
              />
            </div>
            <div class="w-full py-2">
              <span>Current Subjects</span>
              <br />
              <q-chip
                :style="`background-color:${sub.bgColor}`"
                class="text-white"
                dense
                v-for="(sub, index) in selectedUser &&
                selectedUser.extra_info &&
                selectedUser.extra_info.subjects"
                :key="index"
                >{{ sub.label }}</q-chip
              >
            </div>
            <div class="w-full py-2">
              <q-checkbox v-model="canDelete" label="Can Delete?" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Save"
            color="primary"
            @click="updateTa"
            no-caps
            v-close-popup
          />
          <q-btn flat label="Cancel" color="negative" no-caps v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      items: [],
      edit: false,
      program: null,
      Countries: null,
      subjects: [],
      selectedProgram: null,
      selectedCountries: null,
      selectedSubjects: [],
      canDelete: false,
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
    ...mapActions([
      "getPrograms",
      "getProgramSubject",
      "getTeacherAssistant",
      "assignTA",
    ]),
    getImage(event) {
      event.target.src = require("../assets/img/abwaab-user-default.png");
    },
    search() {
      var searchResult = [];
      debugger;
      if (this.Countries) {
        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].extra_info.countryId === this.Countries.value) {
            searchResult.push(this.items[index]);
          }
        }
        this.items = searchResult;
      } else if (this.program) {
        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].extra_info.programId === this.program.value) {
            searchResult.push(this.items[index]);
          }
        }
        this.items = searchResult;
      } else {
        for (let index = 0; index < this.items.length; index++) {
          if (
            this.items[index].extra_info.subjects.id === this.subjects.value
          ) {
            searchResult.push(this.items[index]);
          }
        }
        this.items = searchResult;
      }
      if (!this.items.length) {
        this.Countries = "";
        this.program = "";
        this.subjects = "";
        this.$q.notify({
          message: "No Data Found",
          color: "negative",
          icon: "warning",
        });
        this.$forceUpdate();
        return;
      }
    },
    addTa() {
      let data = {
        id: this.chooseTa,
        extra_info: {
          country: this.Countries.label,
          countryId: this.Countries.value,
          program: this.program.label,
          programId: this.program.value,
          subjects: this.subjects,
        },
      };
      this.assignTA(data);
    },
    updateTa() {
      let data = {
        id: this.chooseTa,
        extra_info: {
          country: this.selectedCountries.label,
          countryId: this.selectedCountries.value,
          program: this.selectedProgram.label,
          programId: this.selectedProgram.value,
          subjects: this.selectedSubjects,
          canDelete: this.canDelete,
        },
      };

      this.assignTA(data);
    },
    getSubjects() {
      this.getProgramSubject(this.program.value);
    },
    getSubjects() {
      this.getProgramSubject(this.selectedProgram.value);
    },
    clear() {
      this.program = null;
      this.subjects = null;
    },
  },
  computed: {
    ...mapGetters(["programs", "ProgramSubjects", "teaching_assistant"]),
    selectedUser() {
      return this.items.filter((item) => {
        return item.id == this.chooseTa;
      })[0];
    },
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
    getSelectedProgramsByCountry() {
      if (this.selectedCountries) {
        let programs = [];
        this.programs.filter((program) => {
          if (program.country == this.selectedCountries.value) {
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
    getSelectedProgramSubjects() {
      this.selectedsubjects = null;
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
    getData() {
      return (this.items = this.teaching_assistant);
    },
  },
};
</script>
<style scoped>
</style>
