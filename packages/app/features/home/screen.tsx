import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  SwitchThemeButton,
  SwitchRouterButton,
  XStack,
  YStack,
  Input,
  Card,
  Select,
  Adapt,
  Image,
  Theme,
  ScrollView,
} from '@my/ui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronDown, ChevronUp, Plus, List, X, ArrowLeft } from '@tamagui/lucide-icons'
import React, { useState, useEffect } from 'react'
import { Platform, FlatList, TouchableOpacity } from 'react-native'
import { useLink } from 'solito/navigation'
import { collection, addDoc, getDocs, DocumentData } from 'firebase/firestore'
import { db } from '../../../../firebaseConfig'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const [items, setItems] = useState<DocumentData[]>([])
  const [showAddNews, setShowAddNews] = useState(false)
  const [showNewsList, setShowNewsList] = useState(false)
  const [selectedNews, setSelectedNews] = useState<DocumentData | null>(null)

  // Yeni haber için state'ler
  const [newsTitle, setNewsTitle] = useState('')
  const [newsImage, setNewsImage] = useState('')
  const [newsDate, setNewsDate] = useState('')
  const [newsDescription, setNewsDescription] = useState('')
  const [newsCategory, setNewsCategory] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'news'))
    const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setItems(fetchedItems)
  }

  const addNews = async () => {
    if (newsTitle.trim() !== '') {
      try {
        await addDoc(collection(db, 'news'), {
          title: newsTitle,
          image: newsImage,
          date: newsDate,
          description: newsDescription,
          category: newsCategory,
        })
        // Form alanlarını temizle
        setNewsTitle('')
        setNewsImage('')
        setNewsDate('')
        setNewsDescription('')
        setNewsCategory('')
        fetchItems()
        setShowAddNews(false) // Formu kapat
        console.log('Haber başarıyla eklendi:', newsTitle)
      } catch (error) {
        console.error('Haber eklenirken bir hata oluştu:', error)
      }
    } else {
      console.warn('Haber eklenemedi: Başlık boş olamaz')
    }
  }

  const showNewsDetails = (news: DocumentData) => {
    setSelectedNews(news)
    setShowNewsList(false)
  }

  const backToNewsList = () => {
    setSelectedNews(null)
    setShowNewsList(true)
  }

  return (
    <Theme name="light">
      <YStack f={1} jc="center" ai="center" p="$4" space="$4" bg="$background">
        <LinearGradient
          start={[0, 0]}
          end={[1, 1]}
          fullscreen
          colors={['$blue5', '$purple5', '$pink5']}
          opacity={0.2}
        />
        
        <H1 ta="center" col="$blue10">
          Haber Uygulaması
        </H1>

        <XStack space="$4">
          <Button
            size="$5"
            theme="active"
            icon={Plus}
            onPress={() => {
              setShowAddNews(true)
              setShowNewsList(false)
              setSelectedNews(null)
            }}
            pressStyle={{ scale: 0.97 }}
            animation="bouncy"
          >
            Haber Ekle
          </Button>
          <Button
            size="$5"
            theme="blue"
            icon={List}
            onPress={() => {
              setShowNewsList(true)
              setShowAddNews(false)
              setSelectedNews(null)
            }}
            pressStyle={{ scale: 0.97 }}
            animation="bouncy"
          >
            Haberleri Göster
          </Button>
        </XStack>

        {showAddNews && (
          <Card elevate size="$4" bordered p="$4" space="$4" w="100%" maw={400} bg="$background">
            <H1 size="$6" col="$blue10">Yeni Haber Ekle</H1>
            <Input
              size="$4"
              borderWidth={2}
              placeholder="Haber başlığı"
              value={newsTitle}
              onChangeText={setNewsTitle}
            />
            <Input
              size="$4"
              borderWidth={2}
              placeholder="Haber fotoğrafı (link)"
              value={newsImage}
              onChangeText={setNewsImage}
            />
            <Input
              size="$4"
              borderWidth={2}
              placeholder="Haber tarihi"
              value={newsDate}
              onChangeText={setNewsDate}
            />
            <Input
              size="$4"
              borderWidth={2}
              placeholder="Haber açıklaması"
              value={newsDescription}
              onChangeText={setNewsDescription}
              multiline
              numberOfLines={3}
            />
            <Select value={newsCategory} onValueChange={setNewsCategory}>
              <Select.Trigger w={200} iconAfter={ChevronDown}>
                <Select.Value placeholder="Kategori seçin" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet modal dismissOnSnapToBottom>
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay />
                </Sheet>
              </Adapt>
              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton ai="center" jc="center" pos="relative" w="100%" h="$3">
                  <YStack zi={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$background', '$backgroundTransparent']}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>
                <Select.Viewport minWidth={200}>
                  <Select.Group>
                    <Select.Label>Kategoriler</Select.Label>
                    {['Spor', 'Politika', 'Ekonomi', 'Teknoloji', 'Sağlık'].map(
                      (item, index) => (
                        <Select.Item key={item} value={item} index={index}>
                          <Select.ItemText>{item}</Select.ItemText>
                          <Select.ItemIndicator ml="auto">
                            <ChevronDown size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      )
                    )}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton ai="center" jc="center" pos="relative" w="100%" h="$3">
                  <YStack zi={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$backgroundTransparent', '$background']}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
            <Button theme="green" onPress={addNews} pressStyle={{ scale: 0.97 }} animation="bouncy">
              Haber Ekle
            </Button>
          </Card>
        )}

        {showNewsList && !selectedNews && (
          <Card elevate size="$4" bordered p="$4" space="$4" w="100%" maw={600} bg="$background">
            <H1 size="$6" col="$blue10">Haberler</H1>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => showNewsDetails(item)}>
                  <Card elevate bordered mb="$4" p="$4" bg="$background">
                    <Image
                      source={{ uri: item.image }}
                      width={300}
                      height={200}
                      resizeMode="cover"
                      mb="$2"
                    />
                    <H1 size="$5" mb="$2" col="$blue10">{item.title}</H1>
                    <XStack space="$2" mb="$2">
                      <Paragraph fontSize="$2" opacity={0.6}>{item.date}</Paragraph>
                      <Paragraph fontSize="$2" opacity={0.6}>{item.category}</Paragraph>
                    </XStack>
                  </Card>
                </TouchableOpacity>
              )}
            />
          </Card>
        )}

        {selectedNews && (
          <ScrollView w="100%" maw={600}>
            <Card elevate size="$4" bordered p="$4" space="$4" bg="$background">
              <Button
                size="$4"
                theme="gray"
                icon={ArrowLeft}
                onPress={backToNewsList}
                alignSelf="flex-start"
                mb="$4"
              >
                Geri
              </Button>
              <Image
                source={{ uri: selectedNews.image }}
                width={300}
                height={200}
                resizeMode="cover"
                mb="$2"
              />
              <H1 size="$6" mb="$2" col="$blue10">{selectedNews.title}</H1>
              <Paragraph mb="$2">{selectedNews.description}</Paragraph>
              <XStack space="$2" mb="$2">
                <Paragraph fontSize="$2" opacity={0.6}>{selectedNews.date}</Paragraph>
                <Paragraph fontSize="$2" opacity={0.6}>{selectedNews.category}</Paragraph>
              </XStack>
            </Card>
          </ScrollView>
        )}
      </YStack>
    </Theme>
  )
}

